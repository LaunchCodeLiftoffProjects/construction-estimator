import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/project';
import { Item } from 'src/app/item';
import { Selection } from 'src/app/selection';
import { ItemDetails } from 'src/app/item-details';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})



export class ProjectDetailsComponent implements OnInit {

  project: Project;
  projectURL = "http://localhost:8080/api/project/";
  id: string; // project ID
  editingProject: boolean = false; // for editing basic project info at top right of page

  itemsArray: Item[]; // to get all possible items (serves dual purpose - display and data for calculations)

  rooms: string[] = [ "kitchen", "bathroom", "living" ];
  roomTitles: string[] = [ "Kitchen", "Bathroom", "Bedroom/Living/Other" ];
  categories: string[] = [ "appliance", "fixture", "finish" ];
  categoryTitles = [ "Appliances", "Fixtures", "Finishes" ];

  needsQuantity: string[] = ['Dishwasher','Disposal','Microwave/Hood','Oven/Range','Refrigerator',
              'Bath & Shower', 'Ceiling Light/Fan', 'Electrical Outlets', 'Electrical Switches', 
              'Lighting', 'Sink', 'Specialty', 'Toilet', 'Doors', 'Lower Cabinets', 'Upper Cabinets', 
              'Windows'];
              

  selectionArray: Selection[]; // for facilitating data binding with item selections
  
  currentID: number = 1; // this is temporary, only because of the way the itemDetails constructor is set up (both its own id and itemId)

  
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");

    console.log("Id", this.id);

    this.projectURL = this.projectURL + this.id;
    this.loadItems(); // moved this out since it is independent of project object
    console.log("Items loaded.");
    this.loadProject();
    console.log("Project Loaded");

  }


  // GET EXISTING PROJECT

  // get project object from database (and any saved information from previous session if not first time)
  loadProject() {

    fetch(this.projectURL).then(function (response) {
      response.json().then(function (json) {
        this.project = new Project(json.name, json.roomType, json.roomLength, json.roomWidth, json.roomHeight);
        this.project.id = json.id;
        this.project.itemDetails = json.itemDetails;
        this.createSelections(); // use any saved details to create objects for looping on form
        console.log("Selection objects created.");
      }.bind(this));
    }.bind(this));

  }


  // GET BASIC ITEMS AND PROPERTIES FOR DISPLAY 

  // get all possible items that could be displayed and selected from JSON file
  loadItems() {
    fetch("http://localhost:8080/api/item/").then(function (response) {
      response.json().then(function (json) {
        this.itemsArray = [];
        json.forEach(obj => {
          let item = new Item(obj.id, obj.name, obj.room, obj.category, obj.type, obj.price);
          this.itemsArray.push(item);
        });
        this.itemsArray.sort((a, b) => (a.type > b.type) ? 1 : -1);
      }.bind(this));
    }.bind(this));

  }

  // helper function to locate item types already included in selectionArray as it is being filled
  locateSelection(item: Item): number {
    let selection: Selection;
    for (let i=0; i<this.selectionArray.length; i++) {
      selection = this.selectionArray[i];
      if (selection.type === item.type) {
        return i;
      } 
    }
    return -1; // if not found
  }

  // check to see if details have been saved to this project before or not, and create Selection objects accordingly
  createSelections() {
    let size: number = this.project.itemDetails.length;
    let selection: Selection;
    let details: ItemDetails;
    let item: Item;
    if (size > 0) { // if project already has a saved estimate and itemDetails
      for (let i=0; i < size; i++) {
        details = this.project.itemDetails[i];
        item = this.getItemByID(details.itemId); 
        if (item.room.includes(this.project.roomType)) { // just in case something has shifted
          selection = new Selection(item.category, item.type, true, item.name, details.quantity);
          this.selectionArray.push(selection);
          console.log("Added", selection, "to selectionArray");
        }
      }
    }
    // create Selection objects for any types not previously saved to project
    for (let j=0; j < this.itemsArray.length; j++) {
      item = this.itemsArray[j];
      if (item.room.includes(this.project.roomType) && this.locateSelection(item) === -1) {
        selection = new Selection(item.category, item.type, false); // will default to initialized values for selected & quantity
        this.selectionArray.push(selection);
        console.log("Added", selection, "to selectionArray");
      }
    }
  }  

  // for each type, build a list of available options to display for dropdown lists - string value will save upon form submission
  getOptions(itemType: string) {
    let optionsArray = [];
    let item: Item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.type === itemType && item.room.includes(this.project.roomType)) {
        optionsArray.push(item);
      }
    }
    optionsArray.sort((a, b) => (a.name > b.name) ? 1 : -1);
    return optionsArray;
  }
  


  // GET INFO ON MATERIALS & LABOR FOR CALCULATIONS

  // need to set this up



  // UPON FORM SUBMISSION, GATHER SELECTED ITEMS, CALCULATE, AND SAVE TO PROJECT

  // look to see if itemDetails object already exists in project itemsDetails array
  findItemDetails(itemType: string): ItemDetails {
    if (this.project.itemDetails.length > 0) {
      for (let i=0; i < this.itemsArray.length; i++) {
        let item: Item;
        let details: ItemDetails;
        for (let j=0; j < this.project.itemDetails.length; j++) {
          item = this.itemsArray[i];
          details = this.project.itemDetails[j]
          // check all available items in itemsArray with current type against item IDs saved in project.itemDetails
          if (item.type === itemType && item.id === details.itemId) {
            return details;
          }
        }
      }
    }
    return null; // if not found
  }

  getItemByTypeAndName(itemType: string, name: string): Item {
    let item: Item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.type === itemType && item.name === name) {
        return item;
      }
    }
    return null;
  }

  getItemByID(itemID): Item {
    let item: Item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.id === itemID) {
        return item;
      }
    }
    return null;
  }

  //get fresh ID number for new ItemDetails items - can't remember how this is supposed to happen otherwise
  getID(): number {
    this.currentID++;
    return this.currentID;
  }

  // use data from original JSON file of all items to calculate for each selected item
  calculateItemDetails() {
    // calculations not yet written
  }

  // calculate category totals and save to an estimate object
  saveEstimate() {
    // this needs to be written once estimate class is available on both ends
    // reference completed itemDetailsArray and get subtotals by category
    // return estimate object
  }

 // save itemDetails array and estimate object to project and save project to database
 saveProject() {

    // save itemDetails to project
    fetch("http://localhost:8080/api/project/" + this.project.id + "/details", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(this.project.itemDetails),
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log('Success:', data);
    }).catch(function (error) {
      console.error('Error:', error);
    });

    // save estimate to project
    // TODO

    // save entire project object to database
    fetch("http://localhost:8080/api/project/" + this.project.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(this.project),
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log('Success:', data);
    }).catch(function (error) {
      console.error('Error:', error);
    });

  }

}
