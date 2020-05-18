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
              

  selectionArray: Selection[] = []; // for facilitating data binding with item selections

  
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    console.log("Id", this.id);
    this.projectURL = this.projectURL + this.id;
    this.loadProject();
    console.log("Project Loaded");
  }


  // GET EXISTING PROJECT

  // get project object from database (and any saved information from previous session if not first time)
  loadProject() {

    fetch(this.projectURL).then(function (response) {
      response.json().then(function (json) {
        this.project = new Project(json.name, json.roomType, json.roomLength, json.roomWidth, json.roomHeight);
        console.log("Project name is", this.project.name);
        this.project.id = json.id;
        this.project.itemDetails = json.itemDetails; // get last saved array to prefill form with last saved values
        // this.project.estimate = []; // reset so new estimate can be built
        this.loadItems(); // put here so things load in order
        console.log("Items loaded.");
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
        this.createSelections(); // now that items have been loaded
        console.log("Selection objects created.");
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
    this.selectionArray = []; // reset this array if method is called again prior to form submission due to roomType change
    let selection: Selection;
    let details: ItemDetails; 
    let item: Item;
    if (this.project.itemDetails.length > 0) { // if project already has a saved itemDetails array
      for (let i=0; i < this.project.itemDetails.length; i++) {
        details = this.project.itemDetails[i];
        item = this.itemsArray[this.getItemByID(details.itemId)]; 
        if (item.room.includes(this.project.roomType)) { // if the room type has been changed for some reason
          selection = new Selection(item.category, item.type, true, item.name, details.quantity);
          this.selectionArray.push(selection);
        }
      }
    }
    // create Selection objects for any types not previously saved to project
    for (let j=0; j < this.itemsArray.length; j++) {
      item = this.itemsArray[j];
      if (item.room.includes(this.project.roomType) && this.locateSelection(item) === -1) {
        selection = new Selection(item.category, item.type, false); // default to initialized values for 'selected' & 'quantity'
        this.selectionArray.push(selection);
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


  // UPON FORM SUBMISSION, GATHER SELECTED ITEMS, CALCULATE, AND SAVE TO PROJECT

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

  getItemByID(itemID: number): number {
    let item: Item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.id === itemID) {
        return i;
      }
    }
    return -1;
  }

  //
  getItemIdByName(name: string): number {
    let id: number;
    let item: Item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.name === name) {
        return item.id;
      }
    }
  }

  // use data from original JSON file of all items to calculate for each selected item
  calculateFinalPrice(item: Item, details: ItemDetails): number {
    let itemCost: number;
    // TODO: calculate for one item based on quantity, linear feet, or square feet
    return itemCost;
  }

  // assign factors and determine additional costs for materials needed
  calculateMaterials(selection: Selection): number {
    let materialCost: number;
    // TODO: calculate additional cost for materials needed for an item
    return materialCost;
  }

  // assign factors and determine additional costs for labor needed
  calculateLabor(selection: Selection): number {
    let laborCost: number;
    // TODO: calculate additional cost for materials needed for an item
    return laborCost;
  }

  // build estimate object as each item is calculated
  buildEstimate(item: Item, cost: number) {
    // TODO: check each item for category and add cost to matching subtotals
    // call all three calculation helper methods
  }

  // iterate through selectionArray, build itemDetails array and Estimate object
  buildProject() {
    this.project.itemDetails = []; // reset project's itemDetails array to remove any prior saved objects and values
    let selection: Selection;
    let id: number;
    let item: Item;
    let details: ItemDetails;
    let detailsArray: ItemDetails[] = [];
    for (let i=0; i < this.selectionArray.length; i++) {
      selection = this.selectionArray[i];
      if (selection.checked) { // create itemDetails object only if user checked the box for this type
        id = this.getItemIdByName(selection.selected);
        item = this.itemsArray[this.getItemByID(id)];
        details = new ItemDetails(id); // create and set itemId property
        details.quantity = selection.quantity;
        // details.finalPrice = calculateFinalPrice(item, details);
        this.project.itemDetails.push(details);
        // this.buildEstimate(item, details.finalPrice);
      }
    }
  }

  // save everything to database
  saveProject() {

    // create ItemDetails array and Estimate object from form data
    this.buildProject();

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

    // TODO: save Materials object to project

    // TODO: save Labor object to project

    // TODO: save Estimate object to project

    // save entire Project object to database
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
