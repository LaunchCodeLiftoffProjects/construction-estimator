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
  dataLoaded: boolean = false; // to prevent page from rendering before project, items, and selections are ready
  editingProject: boolean = false; // for editing basic project info at top right of page

  perimeter: number = 2 * this.project.roomLength + 2 * this.project.roomWidth;
  wallArea: number = this.perimeter * this.project.roomHeight;
  floorArea: number = this.project.roomLength * this.project.roomWidth;

  itemsArray: Item[]; // to get all possible items (serves dual purpose - display and data for calculations)

  rooms: string[] = [ "kitchen", "bath", "living" ];
  roomTitles: string[] = [ "Kitchen", "Bathroom", "Bedroom/Living/Other" ];
  categories: string[] = [ "appliance", "fixture", "finish" ];
  categoryTitles = [ "Appliances", "Fixtures", "Finishes" ];

  selectionArray: Selection[] = []; // for facilitating data binding with item selections

  calcByQuantity: string[] = ['Dishwasher', 'Disposal', 'Range Hood', 'Oven/Range', 'Refrigerator',
              'Bath & Shower', 'Ceiling Light/Fan', 'Electrical Outlets', 'Electrical Switches', 
              'Lighting', 'Shelving', 'Sink', 'Faucet', 'Toilet', 'Doors', 'Cabinets, Lower', 
              'Cabinets, Upper', 'Windows'];
  calcByLF: string[] = ['Baseboards', 'Trim'];
  calcBySF: string[] = ['Flooring', 'Walls'];
  calcByCabinet: string[] = ['Backsplash', 'Countertop'];
              
  factorIntoPlumbing: string[] = ['Dishwasher', 'Disposal', 'Refrigerator', 'Bath & Shower', 'Sink', 'Faucet', 'Toilet'];
  factorIntoElectrical: string[] = ['Dishwasher', 'Disposal', 'Range Hood', 'Oven/Range', 'Refrigerator',
              'Ceiling Light/Fan', 'Electrical Outlets', 'Electrical Switches', 'Lighting'];
  factorIntoFinishWork: string[] = ['Shelving', 'Doors', 'Cabinets, Lower', 'Cabinets, Upper', 'Windows',
              'Baseboards', 'Trim', 'Flooring', 'Walls', 'Backsplash', 'Countertop'];


  materials: Materials;
  labor: Labor;

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
        this.materials = json.materials;
        this.labor = json.labor;
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
          let item = new Item(obj.id, obj.name, obj.room, obj.category, obj.type, obj.price, obj.roughMaterials, obj.labor);
          this.itemsArray.push(item);
        });
        this.itemsArray.sort((a, b) => (a.type > b.type) ? 1 : -1);
        this.createSelections(); // now that project and items have been loaded
        console.log("Selection objects created.");
        this.dataLoaded = true; // allow page to render
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
  createSelections() { // FIXME: Rework this so current selections aren't lost if room type is changed
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

  // calculate for each selected item based on quantity or measurements
  calculateCosts(item: Item, selection: Selection): number[] {
    let itemCost: number = 0;
    let materialCost: number = 0;
    let laborCost: number = 0;
    let costs: number[] = [];
    if (this.calcByQuantity.includes(item.type)) {
      itemCost = selection.quantity * item.price;
      materialCost = selection.quantity * item.roughMaterials;
      laborCost = selection.quantity * item.labor;
    } else if (this.calcByLF.includes(item.type)) {
      itemCost = this.perimeter * item.price;
      materialCost = this.perimeter * item.roughMaterials;
      laborCost = this.perimeter * item.labor;
    } else if (this.calcByCabinet.includes(item.type)) {
      let index: number = this.locateSelection("Cabinets, Lower");
      let cabinet: Selection = this.selectionArray[index];
      itemCost = cabinet.quantity * 2 * item.price; // if no lower cabinets have beens selected, this will result in 0
      materialCost = cabinet.quantity * item.roughMaterials;
      laborCost = cabinet.quantity * item.labor;
    } else if (item.type === "Wall") {
      itemCost = this.wallArea * item.price;
      materialCost = this.wallArea * item.roughMaterials;
      laborCost = this.wallArea * item.labor;
    } else if (item.type === "Flooring") { 
      itemCost = this.floorArea * item.price;
      materialCost = this.floorArea * item.roughMaterials;
      laborCost = this.floorArea * item.labor;
    }
    costs = [itemCost, materialCost, laborCost];
    return costs;
  }

  // build estimate object as each item is calculated
  buildEstimate(item: Item, selection: Selection, costs: number[]) {

    // check item for category and add cost to matching subtotal
    if (selection.category === 'appliance') {
      this.estimate.appliancesCost += costs[0];
    } else if (selection.category === 'fixture') {
      this.estimate.fixturesCost += costs[0];
    } else if (selection.category === 'finish') {
      this.estimate.finishesCost += costs[0];
    }
    // add any related materials cost - will add in only once if appliance involveds both plumbing & electrical
    if (this.materials.needPlumbingSystem === true && this.factorIntoPlumbing.includes(selection.type)) {
      this.estimate.materialsCost += costs[1];
    } else if (this.materials.needElectricalSystem === true && this.factorIntoElectrical.includes(selection.type)) {
      this.estimate.materialsCost += costs[1];
    }
    // Note: framing and drywall costs added separately since not tied to specific items, just dimensions of room

    // add any related labor cost - will add in only once if appliance involves both plumbing & electrical
    if (this.labor.needPlumbingSub === true && this.factorIntoPlumbing.includes(selection.type)) {
      this.estimate.laborCost += costs[2];
    } else if (this.labor.needElectricalSub === true && this.factorIntoElectrical.includes(selection.type)) {
      this.estimate.laborCost += costs[2];
    }
    // Note: rough carpentry labor costs added separately since not tied to specific items, just dimensions of room
    if (this.labor.needFinishWork === true && this.factorIntoFinishWork.includes(selection.type)) {
      this.estimate.laborCost += costs[2];
    }
  
  }


  // BUILD PROJECT AND SAVE ALL OBJECTS TO DATABASE

  // iterate through selectionArray, build itemDetails array and Estimate object
  buildProject() {

    this.project.itemDetails = []; // reset project's itemDetails array to remove any prior saved objects and values
    let selection: Selection;
    let id: number;
    let item: Item;
    let details: ItemDetails;
    let costs: number[];

    for (let i=0; i < this.selectionArray.length; i++) {
      selection = this.selectionArray[i];
      if (selection.checked) { 
        id = this.getItemIdByName(selection.selected);
        item = this.itemsArray[this.getItemByID(id)]
        costs = this.calculateCosts(item, selection); // costs for item, rough materials, and labor

        // create itemDetails object and add to project
        details = new ItemDetails(id); // create and set itemId property
        details.quantity = selection.quantity; // set quantity
        details.finalPrice = costs[0]; // set finalPrice
        this.project.itemDetails.push(details);

        // add per-item costs into estimate
        this.buildEstimate(item, selection, costs);
      }
    }

    // add remaining material & labor costs based on room dimensions, not items
    if (this.materials.needFraming === true) {
      this.estimate.materialsCost += 10 * this.wallArea; // $10/SF of wall area
    }
    if (this.materials.needDrywall === true) {
      this.estimate.materialsCost += 25 * this.wallArea; // $25/SF of wall area
    }
    if (this.labor.needRoughCarpentry === true) {
      this.estimate.laborCost += 10 * this.wallArea; // $10/SF of wall area
    }

    // calculate total cost and save to estimate
    this.estimate.totalCost = this.estimate.appliancesCost +
                              this.estimate.fixturesCost +
                              this.estimate.finishesCost +
                              this.estimate.materialsCost +
                              this.estimate.laborCost;

    console.log("ESTIMATE: \nAppliances:", this.estimate.appliancesCost, "\nFixtures:", this.estimate.fixturesCost,
                "\nFinishes:", this.estimate.finishesCost, "\nMaterials:", this.estimate.materialsCost,
                "\nLabor:", this.estimate.laborCost, "\nTOTAL COST:", this.estimate.totalCost);
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

    // TODO: save this.materials to this.project.materials and send to database

    // TODO: save this.labor to this.project.labor and send to database

    // TODO: save this.estimate to this.project.estimate and send to database

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
