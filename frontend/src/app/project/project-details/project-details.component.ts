import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/project';
import { Item } from 'src/app/item';
import { Selection } from 'src/app/selection';
import { ItemDetails } from 'src/app/item-details';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Materials } from 'src/app/materials';
import { Labor } from 'src/app/labor';
import { Estimate } from 'src/app/estimate';


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

  rooms: string[] = [ "kitchen", "bath", "living" ];
  roomTitles: string[] = [ "Kitchen", "Bathroom", "Bedroom/Living/Other" ];
  categories: string[] = [ "appliance", "fixture", "finish" ];
  categoryTitles = [ "Appliances", "Fixtures", "Finishes" ];

  calcByQuantity: string[] = ['Dishwasher','Disposal','Microwave/Hood','Oven/Range','Refrigerator',
              'Bath & Shower', 'Ceiling Light/Fan', 'Electrical Outlets', 'Electrical Switches', 
              'Lighting', 'Shelving', 'Sink', 'Toilet', 'Doors', 'Cabinets, Lower', 'Cabinets, Upper', 
              'Windows'];
  calcByLF: string[] = ['Baseboards','Trim'];
  calcBySF: string[] = ['Flooring','Walls'];
  calcByCabinet: string[] = ['Backsplash','Countertop'];
              
  selectionArray: Selection[] = []; // for facilitating data binding with item selections

  // materials: Materials;
  // labor: Labor;
  materials: Materials = new Materials; // had to initialize to new instance because project object is bringing null objects
  labor: Labor = new Labor; // had to initialize to new instance because project object is bringing null objects

  estimate: Estimate = new Estimate; // not needed for modeling but for calculations
  
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
        this.project.id = json.id;
        this.project.itemDetails = json.itemDetails;
        // this.materials = json.materials; // null?
        // this.labor = json.labor; // null?
        // do not need to load previous estimate because a new one will be built from scratch
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
        this.createSelections(); // now that project and items have been loaded
        console.log("Selection objects created.");
        // TODO: toggle boolean to allow page to display
      }.bind(this));
    }.bind(this));
  }

  // locate item types already included in selectionArray as it is being filled
  locateSelection(type: string): number {
    let selection: Selection;
    for (let i=0; i<this.selectionArray.length; i++) {
      selection = this.selectionArray[i];
      if (selection.type === type) {
        return i;
      } 
    }
    return -1; // if not found
  }

  // check to see if details have been saved to this project before or not, and create Selection objects accordingly
  createSelections() {
    this.selectionArray = []; // rebuild this array if method is called again prior to form submission due to roomType change
    let selection: Selection;
    let details: ItemDetails; 
    let item: Item;
    if (this.project.itemDetails.length > 0) { // if project already has a saved itemDetails array, get values
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
      if (item.room.includes(this.project.roomType) && this.locateSelection(item.type) === -1) {
        selection = new Selection(item.category, item.type, false); // default to initialized values for 'selected' & 'quantity'
        this.selectionArray.push(selection);
      }
    }
    this.selectionArray.sort((a, b) => (a.type > b.type) ? 1 : -1);
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

  // when item selection is checked in form, if zero, raise to 1
  changeQuantity(selection: Selection, qty: number): number {
    if (this.calcByQuantity.includes(selection.type) && selection.checked === true && qty === 0) {
      return 1;
    } else {
      return qty;
    }
  }


  // GETTERS

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

  getItemIdByName(name: string): number {
    let item: Item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.name === name) {
        return item.id;
      }
    }
  }


  // CALCULATE ESTIMATE

  // use data from original JSON file of all items to calculate for each selected item
  calculateFinalPrice(item: Item, selection: Selection): number {
    let itemCost: number = 0;
    let perimeter = 2 * this.project.roomLength + 2 * this.project.roomWidth;
    let wall = perimeter * this.project.roomHeight;
    let area = this.project.roomLength * this.project.roomWidth;
    if (this.calcByQuantity.includes(item.type)) {
      itemCost = selection.quantity * item.price;
    } else if (this.calcByLF.includes(item.type)) {
      itemCost = perimeter * item.price;
    } else if (this.calcByCabinet.includes(item.type)) {
      let index = this.locateSelection("Cabinets, Lower");
      let selection = this.selectionArray[index];
      itemCost = selection.quantity * 2 * item.price; // right now if no lower cabinets have beens selected, this will result in 0
    } else if (item.type === "Wall") {
      itemCost = wall * item.price;
    } else if (item.type === "Flooring") { 
      itemCost = area * item.price;
    }
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
    // call all three calculation helper methods (maybe do this differently since that would calculate per item cost twice)
  }


  // BUILD PROJECT OBJECT AND SAVE ALL OBJECTS TO DATABASE

  // iterate through selectionArray, build itemDetails array and Estimate object
  buildProject() {
    this.project.itemDetails = []; // reset project's itemDetails array to remove any prior saved objects and values
    let selection: Selection;
    let id: number;
    let item: Item;
    let details: ItemDetails;
    for (let i=0; i < this.selectionArray.length; i++) {
      selection = this.selectionArray[i];
      if (selection.checked) { // create itemDetails object only if user checked the box for this type
        id = this.getItemIdByName(selection.selected);
        item = this.itemsArray[this.getItemByID(id)];
        details = new ItemDetails(id); // create and set itemId property
        details.quantity = selection.quantity;
        // details.finalPrice = calculateFinalPrice(item, selection);
        this.project.itemDetails.push(details);
        // this.buildEstimate(item, details.finalPrice);
      }
    }
  }

  // called only when submit button is clicked - processes input and sends everything to database
  saveProject() {

    // create ItemDetails array and run calculations for estimate based on user input
    this.buildProject();

    // save itemDetails objects to database
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

    // TODO: materials

    // TODO: labor

    // TODO: estimate

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
