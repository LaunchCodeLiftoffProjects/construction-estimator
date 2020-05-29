import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms';

// classes
import { Project } from 'src/app/project';
import { Item } from 'src/app/item';
import { Selection } from 'src/app/selection';
import { ItemDetails } from 'src/app/item-details';
import { Materials } from 'src/app/materials';
import { Labor } from 'src/app/labor';
import { Estimate } from 'src/app/estimate';

// services
import { TokenStorageService } from 'src/app/_services/token-storage.service';


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
  firstLoad: boolean = false;

  private roles: string[];
  isLoggedIn: boolean = false;
  showAdminBoard: boolean = false;
  showModeratorBoard: boolean = false;
  username: string;
  userId: number;

  editingProject: boolean = false; // for editing basic project info at top right of page
  changedRoom: boolean = false;
  changedDimensions: number = 0;

  itemsArray: Item[]; // to get all possible items (serves dual purpose - info for display and data for calculations)

  selectionArray: Selection[][] = [[],[],[]]; // for facilitating data binding with item selections in form

  rooms: string[] = [ "kitchen", "bath", "living" ];
  roomTitles: string[] = [ "Kitchen", "Bathroom", "Bedroom/Living/Other" ];
  categories: string[] = [ "appliance", "fixture", "finish" ];
  categoryTitles = [ "Appliances", "Fixtures", "Finishes" ];

  perimeter: number;
  wallArea: number;
  floorArea: number;

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


  constructor(private route: ActivatedRoute, private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    console.log("Project ID is", this.id);
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.name;
      this.userId = user.id;
      console.log("User ID is", this.userId);
    } else {
      this.router.navigate(['/login']);
    }
    this.projectURL = this.projectURL + this.id;
    this.firstLoad = true;
    this.loadProject();
    console.log("PROJECT LOADED FROM DATABASE");
  }


  /***** LOAD PROJECT FROM DATABASE *****/

  // includes saved information from previous session if revising an existing estimate
  loadProject() {

    fetch(this.projectURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Barer ' + this.tokenStorageService.getToken()
      }
    }).then(function (response) {
      response.json().then(function (json) {
        console.log(JSON.stringify(json));
        this.project = new Project(json.name, json.roomType, json.roomLength, json.roomWidth, json.roomHeight);
        this.project.id = json.id;
        this.project.itemDetails = json.itemDetails;

        // pull out materials and labor objects. create new ones if null
        this.project.materials = (json.materials === null ? new Materials : json.materials);
        this.project.labor = (json.labor === null ? new Labor : json.labor);
        this.project.estimate = (json.estimate === null ? new Estimate : json.estimate);

        this.calcMeasurements(); // calculate perimeter, wall area, and floor area

        this.loadItems(); // put here so things load in order
        console.log("ITEMS JSON LOADED");
        
      }.bind(this));
    }.bind(this));
  }


  /***** LOAD BASIC ITEMS AND PROPERTIES FROM JSON *****/

  loadItems() {
    fetch("http://localhost:8080/api/item/").then(function (response) {
      response.json().then(function (json) {
        this.itemsArray = [];
        json.forEach(obj => {
          let item = new Item(obj.id, obj.name, obj.room, obj.category, obj.type, obj.price, obj.roughMaterial, obj.labor);
          this.itemsArray.push(item);
        });
        this.itemsArray.sort((a, b) => (a.type > b.type) ? 1 : -1);
        this.createSelections(); // now that project and items have been loaded
        console.log("SELECTION ARRAY FILLED");
      }.bind(this));
    }.bind(this));
  }


  /***** CREATE SELECTION OBJECTS FOR TWO-WAY DATA BINDING *****/

  createSelections() { 
    if (this.firstLoad === true || this.changedRoom === true) {
      this.selectionArray = [[],[],[]];
      let item: Item;
      let c: number;
      // put type in one of three subarrays depending on category
      for (let j=0; j < this.itemsArray.length; j++) {
        item = this.itemsArray[j];
        c = this.categories.indexOf(item.category);
        if (item.room.includes(this.project.roomType) && this.findSelectionByType(item.type, c) === -1) {
          let selection = this.createNewSelection(item.type);
          this.selectionArray[c].push(selection);
        }
      }
      // alpha sort each subarray (category)
      this.selectionArray[0].sort((a, b) => (a.type > b.type) ? 1 : -1);
      this.selectionArray[1].sort((a, b) => (a.type > b.type) ? 1 : -1);
      this.selectionArray[2].sort((a, b) => (a.type > b.type) ? 1 : -1);

      this.changedRoom = false;
      this.firstLoad = false;
      this.dataLoaded = true; // allow page to render the first time now that all data is available
    }
  }
  
  // for each type, build a list of room-specific options to display for dropdown lists
  getOptions(itemType: string): Item[] {
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

  // FOR RENDERING FORM - returns either last saved info or a default Selection object
  createNewSelection(type: string): Selection {
    let index = this.lookUpDetailsByType(type);
    if (index >= 0) { // an itemDetails object already exists for this type
      let details: ItemDetails = this.project.itemDetails[index];
      if (details.itemId !== null) { // user had it selected at last project save
        let item: Item = this.itemsArray[this.findItemById(details.itemId)];
        console.log("Created Selection object for " + type + " from last saved itemDetails");
        return new Selection(item.category, type, true, item, details.quantity); 
      }
    } else { // project does not have an ItemDetails object for this type or it had been rendered null
      let optionOne: Item = this.getOptions(type)[0];  
      console.log("Created new Selection object for " + type + " in " + optionOne.category + " subarray");
      return new Selection(optionOne.category, type, false, optionOne, 0);
    }
  }


  /***** EVENT HANDLERS FOR ITEM SELECTIONS *****/

  /** The corresponding itemDetails object will not actually be updated unless positive changes are made;
   * if deselected/zeroed, all fields will blank out in the view but the in-session project.itemDetails object will retain
   * their previous selections in case the user changes their mind prior to submitting the form.
   */

  changeChecked(selection: Selection, i: number, c: number) {
    console.log(selection.type + (selection.checked ? " checked" : " unchecked"));
    if (selection.checked) {
      // get either last info saved in itemDetails or defaults
      let lastSaved: Selection = this.createNewSelection(selection.type); 
      this.selectionArray[c][i].checked = true; // because lastSaved.checked may have returned false
      // update other two fields with last saved info
      this.selectionArray[c][i].selected = lastSaved.selected;
      if (this.calcByQuantity.includes(selection.type) && lastSaved.quantity === 0) {
        this.selectionArray[c][i].quantity = 1;
      } else {
        this.selectionArray[c][i].quantity = lastSaved.quantity;
      }
      this.saveItemDetails(this.selectionArray[c][i]); // save/update itemDetails object in project
    } else {
      this.resetSelection(selection); // but do not overwrite corresponding itemDetails object yet
    }  
	}

  // when selection is made in middle column, force checked and quantity
  changeSelected(selection: Selection, i: number, c: number) {
    console.log(selection.type + " selected: " + selection.selected.name); 
    if (selection.checked === false) {
      this.selectionArray[c][i].checked = true;
    }  
    let lastSaved: Selection = this.createNewSelection(selection.type); // just to check quantity
    if (this.calcByQuantity.includes(selection.type) && lastSaved.quantity === 0) {
      this.selectionArray[c][i].quantity = 1;
    } else {
      this.selectionArray[c][i].quantity = lastSaved.quantity;
    }
    this.saveItemDetails(this.selectionArray[c][i]); // save/update itemDetails object in project
  }

  changeQuantity(selection: Selection, i: number, c: number) {
    console.log("Quantity for " + selection.type + " changed to " + selection.quantity);
    // force other fields to sync up if quantity increased (but not checked) or negative number input
    if ((selection.quantity > 0 && !selection.checked) || (selection.quantity < 0 && selection.checked)) {
      let lastSaved: Selection = this.createNewSelection(selection.type);
      // update other two fields
      this.selectionArray[c][i].checked = true;
      this.selectionArray[c][i].selected = lastSaved.selected;
      this.saveItemDetails(this.selectionArray[c][i]); // save/update itemDetails object in project
    } else if (selection.quantity <= 0) {
      this.resetSelection(selection); // but do not overwrite corresponding itemDetails object yet
    } else { // if quantity is being raised from 1 or more
      this.saveItemDetails(this.selectionArray[c][i]); // update itemDetails object in project
    }

  }
 
  /***** SAVE ITEM DETAILS TO PROJECT EACH TIME VALUE IS CHANGED IN FORM *****/

  // save one itemDetails object at a time with selection info
  saveItemDetails(selection: Selection) {

    if (selection.checked) { 
      // check to see if itemDetails object already exists
      let index = this.lookUpDetailsByType(selection.type);

      // TODO: (maybe) un-comment if adding functionality to display line item cost dynamically
      // let costs = this.calculateCosts(selection); // costs for item, rough materials, and labor
      if (index >= 0) {
        this.project.itemDetails[index].itemId = selection.selected.id; // overwrite itemId
        this.project.itemDetails[index].quantity = selection.quantity; // overwrite quantity
        // TODO: (maybe) un-comment if adding functionality to display line item cost dynamically
        // this.project.itemDetails[index].finalPrice = costs[0];
        console.log("ItemDetails object for " + selection.type + " updated to " + selection.selected.name + " and quantity " + selection.quantity);
      } else {
        let details = new ItemDetails(selection.selected.id); // create object and set itemId property
        details.quantity = selection.quantity; // set quantity
        // TODO: (maybe) un-comment if adding functionality to display line item cost dynamically
        // details.finalPrice = costs[0]; // set finalPrice
        this.project.itemDetails.push(details);
        console.log("ItemDetails object for " + selection.type + " added to project");
      }
      // TODO: (maybe) un-comment if adding functionality to display line item cost dynamically
      // this.buildEstimate(item, selection, costs);
    }
    // unchecked items will be handled in buildProject() at form submission
  } 

  // reset checkbox, select dropdown, and quantity fields all at once
  resetSelection(selection: Selection) {
    selection.checked = false;
    selection.selected = this.getOptions(selection.type)[0];
    selection.quantity = 0;
    console.log("All input fields for " + selection.type + " reset");
    // DO NOT save to corresponding itemDetails object
  }

  // when changing roomType in the project edit block, reset the itemDetails objects for any selections that the user
  // unchecked prior to entering the project edit block - so that when the user exits the block and a new selectionArray
  // is created based on the new roomType, they will remain unchecked (as the user would expect)
  saveUncheckedItems() {
    let selection: Selection;
    let index: number;
    for (let c=0; c < 3; c++) { // once for each category subarray of selectionArray
      for (let i=0; i < this.selectionArray[c].length; i++) {
        selection = this.selectionArray[c][i];
        index = this.lookUpDetailsByType(selection.type); // look for this type in the project itemDetails array
        
        if (index >= 0 && ! selection.checked) { 
            this.resetItemDetails(index, selection.type);
        } 
        // otherwise skip type; no need to change itemDetails object at this point
      }
    }
  }

  // this will not be called until either project edit block is entered or entire form is submitted
  resetItemDetails(index: number, type: string) { 
    this.project.itemDetails[index].itemId = 0;
    this.project.itemDetails[index].quantity = 0;
    this.project.itemDetails[index].finalPrice = 0;
    console.log(type + " was deselected and all its values zeroed in project.itemDetails array");
  }

  /***** BASIC GETTERS *****/

  // get index of Item object within itemsArray using the item ID
  findItemById(itemId: number): number {
    let item: Item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.id === itemId) {
        return i;
      }
    }
    return -1;
  }

  // get index of Selection object within selectionArray using item type
  findSelectionByType(type: string, c: number): number {
    let selection: Selection;
    // check subarray where this type would reside
    for (let i=0; i<this.selectionArray[c].length; i++) {
      selection = this.selectionArray[c][i];
      if (selection.type === type) {
        return i;
      }
    }
    return -1; // if not found
  }

  // get index of ItemDetails object within project.itemDetails array using item type
  lookUpDetailsByType(type: string): number {
    if (this.project.itemDetails.length > 0) {
      let details: ItemDetails;
      let item: Item;
      for (let i=0; i < this.project.itemDetails.length; i++) {
        details = this.project.itemDetails[i];
        if (details.itemId > 0) {
          item = this.itemsArray[this.findItemById(details.itemId)];
          if (item.type === type) {
            return i;
          }
        } 
      }
    }
    return -1;
  }


  /***** RUN CALCULATIONS *****/

  // calculate these from dimensions whenever project info is loaded or changed
  calcMeasurements() {
    this.perimeter = 2 * this.project.roomLength + 2 * this.project.roomWidth;
    this.wallArea = this.perimeter * this.project.roomHeight;
    this.floorArea = this.project.roomLength * this.project.roomWidth;
    console.log("Project measurements set from room dimensions");
  }

  // calculate for each selected item based on quantity or measurements
  calculateCosts(selection: Selection): number[] {
    let item = selection.selected;
    let itemCost: number = 0;
    let materialCost: number = 0;
    let laborCost: number = 0;
    let costs: number[] = [];
    if (this.calcByQuantity.includes(item.type)) {
      itemCost = selection.quantity * item.price;
      materialCost = selection.quantity * item.roughMaterial; // FIXME: need to add in rough materials costs for dishwasher etc
      laborCost = selection.quantity * item.labor;
      console.log(item.type + " calculated by quantity");
    } else if (this.calcByLF.includes(item.type)) {
      itemCost = this.perimeter * item.price;
      materialCost = this.perimeter * item.roughMaterial;
      laborCost = this.perimeter * item.labor;
      console.log(item.type + " calculated by linear feet");
    } else if (this.calcByCabinet.includes(item.type)) {
      let index: number = this.findSelectionByType("Cabinets, Lower", 2);
      let cabinet: Selection = this.selectionArray[2][index];
      itemCost = cabinet.quantity * 2 * item.price; // FIXME: if no lower cabinets have beens selected, this will result in 0 (for now)
      materialCost = cabinet.quantity * item.roughMaterial;
      laborCost = cabinet.quantity * item.labor;
      console.log(item.type + " calculated by number of cabinets");
    } else if (item.type === "Walls") {
      itemCost = this.wallArea * item.price;
      materialCost = this.wallArea * item.roughMaterial;
      laborCost = this.wallArea * item.labor;
      console.log(item.type + " calculated by wall area");
    } else if (item.type === "Flooring") { 
      itemCost = this.floorArea * item.price;
      materialCost = this.floorArea * item.roughMaterial;
      laborCost = this.floorArea * item.labor;
      console.log(item.type + " calculated by floor area");
    } else {
      console.log(item.type + " not categorized for calculation"); // debug
    }
    costs.push(itemCost);
    costs.push(materialCost);
    costs.push(laborCost);
    return costs;
  }


  /***** BUILD ESTIMATE *****/

  // build estimate object as each item is calculated
  buildEstimate(selection: Selection, costs: number[]) {

    // check item for category and add cost to matching subtotal
    if (selection.category === 'appliance') {
      this.project.estimate.appliancesCost += costs[0];
    } else if (selection.category === 'fixture') {
      this.project.estimate.fixturesCost += costs[0];
    } else if (selection.category === 'finish') {
      this.project.estimate.finishesCost += costs[0];
    }
    console.log("Cost for " + selection.type + " item added to estimate: " + costs[0]);

    // add any related materials cost - will add in only once if appliance involveds both plumbing & electrical
    if ((this.project.materials.needPlumbingSystem === true && this.factorIntoPlumbing.includes(selection.type)) 
      || (this.project.materials.needElectricalSystem === true && this.factorIntoElectrical.includes(selection.type))) {
        // Note: framing and drywall costs added separately since not tied to specific items, just dimensions of room
        this.project.estimate.materialsCost += costs[1];
      console.log("Cost for " + selection.type + " rough materials added to estimate: " + costs[1]);
    }

    // add any related labor cost - will add in only once if appliance involves both plumbing & electrical
    if ((this.project.labor.needPlumbingSub === true && this.factorIntoPlumbing.includes(selection.type)) 
      || (this.project.labor.needElectricalSub === true && this.factorIntoElectrical.includes(selection.type))
      || (this.project.labor.needFinishWork === true && this.factorIntoFinishWork.includes(selection.type))) {
      // Note: rough carpentry labor costs added separately since not tied to specific items, just dimensions of room
      this.project.estimate.laborCost += costs[2];
      console.log("Cost for " + selection.type + " labor added to estimate: " + costs[2]);
    }
    
  }


  // BUILD PROJECT

  buildProject() {

    let selection: Selection;
    let index: number;
    let details: ItemDetails;
    let costs: number[];

    // if selected in form, itemDetails objects should already be updated with itemId (and quantity if required)
    for (let c=0; c < 3; c++) { // once for each category subarray of selectionArray
      for (let i=0; i < this.selectionArray[c].length; i++) {
        selection = this.selectionArray[c][i];
        index = this.lookUpDetailsByType(selection.type); // look for this type in the project itemDetails array
        
        if (index >= 0 && selection.checked) { 
          // itemDetails object will already have been updated - just need associated costs
          details = this.project.itemDetails[index];
          costs = this.calculateCosts(selection); // costs for item, rough materials, and labor
          console.log("Costs for " + selection.type + " are " + costs);
          this.project.itemDetails[index].finalPrice = costs[0]; // set finalPrice
          console.log("ItemDetails object for " + selection.type + " updated with final price of " + this.project.itemDetails[index].finalPrice + " (" + costs[0] + ")");   
          this.buildEstimate(selection, costs); // add per-item additional costs into estimate
          console.log("Estimate updated with costs associated with " + selection.type);
        } else if (index >= 0) { // exists but was unchecked at form submission
            this.resetItemDetails(index, selection.type);
        } 
        // otherwise skip type; no need to add itemDetails object at this point
      }
    }

    // if an itemDetails exists in the project with an item type that is no longer relevant to the roomType,
    // it will be left intact because it will not impact the estimate now or in the future unless the roomType
    // is changed again and it becomes relevant

    // complete estimate - add remaining material & labor costs based on room dimensions, not items
    if (this.project.materials.needFraming === true) {
      this.project.estimate.materialsCost += 10 * this.wallArea; // $10/SF of wall area
    }
    if (this.project.materials.needDrywall === true) {
      this.project.estimate.materialsCost += 25 * this.wallArea; // $25/SF of wall area
    }
    if (this.project.labor.needRoughCarpentry === true) {
      this.project.estimate.laborCost += 10 * this.wallArea; // $10/SF of wall area
    }
    console.log("Remaining material and labor costs added to estimate");

    // calculate total cost and save to estimate
    this.project.estimate.totalCost = this.project.estimate.appliancesCost +
                              this.project.estimate.fixturesCost +
                              this.project.estimate.finishesCost +
                              this.project.estimate.materialsCost +
                              this.project.estimate.laborCost;

    console.log("ESTIMATE: \nAppliances:", this.project.estimate.appliancesCost, "\nFixtures:", this.project.estimate.fixturesCost,
                "\nFinishes:", this.project.estimate.finishesCost, "\nMaterials:", this.project.estimate.materialsCost,
                "\nLabor:", this.project.estimate.laborCost, "\nTOTAL COST:", this.project.estimate.totalCost);
  }

  // called only when submit button is clicked - processes input and sends everything to database
  saveProject() {

    // create ItemDetails array and Estimate object based on user input
    this.buildProject();

    // save project to database
    fetch("http://localhost:8080/api/project/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Barer ' + this.tokenStorageService.getToken()
      },
      body: JSON.stringify(this.project),
    }).then(function (response) {
      return response;
    }).then(function (data) {
      console.log('Success:', data);
    }).catch(function (error) {
      console.error('Error:', error);
    });

  }

}
