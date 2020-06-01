import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
import { isPlatformBrowser } from '@angular/common';


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


  /************** CHECKLIST **************/
  // 1 - load project and create selections from existing itemDetails (or defaults)
  // 2 - run calculations per selection and add costs to selection objects
  // 3 - run calculations for each subtotal & total and get info directly from selection objects and dimensions
  // 4 - update both selection and itemDetails with item and quantity with each change, update project.estimate directly with each change
  // 5 - at end, all itemDetails should already be set except for those needing reset due to deselection
  // 6 - at end, all estimate numbers should already be set


  /***** LOAD PROJECT FROM DATABASE *****/

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

        this.calcMeasurements(); // calculate perimeter, wall area, and floor area from room dimensions

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
        this.buildSelectionArray(); // now that project and items have been loaded
        console.log("SELECTION ARRAY FILLED");
      }.bind(this));
    }.bind(this));
  }


  /***** CREATE SELECTION OBJECTS FOR TWO-WAY DATA BINDING *****/

  buildSelectionArray() { 
    if (this.firstLoad === true || this.changedRoom === true) {
      this.selectionArray = [[],[],[]];
      let item: Item;
      let c: number;
      // put type in one of three subarrays depending on category
      for (let j=0; j < this.itemsArray.length; j++) {
        item = this.itemsArray[j];
        c = this.categories.indexOf(item.category);
        if (item.room.includes(this.project.roomType) && this.findSelectionByType(item.type, c) === -1) {
          let selection = this.createSelectionObject(item.type, item.category);
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
  createSelectionObject(type: string, category: string): Selection {
    let index = this.lookUpDetailsByType(type);
    if (index >= 0) { // an itemDetails object already exists for this type
      let details: ItemDetails = this.project.itemDetails[index];
      if (details.itemId !== null) { // user had it selected at last project save
        let item: Item = this.itemsArray[this.findItemById(details.itemId)];
        console.log("Created Selection object for " + type + " from last saved itemDetails");
        let selection = new Selection(category, type, true, item, details.quantity, [0,0,0]); 
        let costs = this.calcCosts(selection); // for pre-filling upon page load if revisiting estimate
        selection.costs = [costs[0],costs[1],costs[2]];
        return selection;
      } 
    } else { // project does not have an ItemDetails object for this type or it had been rendered null
      console.log("Created default Selection object for " + type + " in " + category + " subarray");
      return new Selection(category, type, false, null, 0, [0,0,0]);
    }
  }


  /***** EVENT HANDLERS FOR ITEM SELECTIONS *****/

  /** The corresponding itemDetails object will not actually be updated unless positive changes are made;
   * if deselected/zeroed, all fields will blank out in the view but the in-session project.itemDetails object will retain
   * their previous selections in case the user changes their mind prior to submitting the form.
   */

  changeChecked(i: number, c: number) {
    let selection = this.selectionArray[c][i]; // existing object in array
    console.log(selection.type + (selection.checked ? " checked" : " unchecked"));
    if (selection.checked) {
      // get either last info saved in itemDetails or defaults
      let lastSaved: Selection = this.createSelectionObject(selection.type, selection.category); 
      this.selectionArray[c][i].checked = true; // because lastSaved.checked may have returned false
      // update other properties with last saved info
      this.selectionArray[c][i].selected = lastSaved.selected; // this may be null
      if (this.calcByQuantity.includes(selection.type) && lastSaved.quantity === 0) {
        this.selectionArray[c][i].quantity = 1;
        // do not calculate costs or save itemDetails here because item has not yet been selected from options (still null)
      } else {
        this.selectionArray[c][i].quantity = lastSaved.quantity;
        this.selectionArray[c][i].costs = [lastSaved.costs[0],lastSaved.costs[1],lastSaved.costs[2]];
        this.saveItemDetails(this.selectionArray[c][i]); // save/update itemDetails object in project
      }
    } else { // if type has just been unchecked
      this.resetSelection(selection); // but do not overwrite corresponding itemDetails object yet
    }  
	}

  // when selection is made in middle column, force checked and quantity
  changeSelected(i: number, c: number) {
    let selection = this.selectionArray[c][i]; // get existing object in array
    console.log(selection.type + " selected: " + selection.selected.name); 
    if (selection.checked === false) {
      this.selectionArray[c][i].checked = true;
      let lastSaved: Selection = this.createSelectionObject(selection.type, selection.category); // just to check quantity
      if (this.calcByQuantity.includes(selection.type) && lastSaved.quantity === 0) {
        this.selectionArray[c][i].quantity = 1;
      } else {
        this.selectionArray[c][i].quantity = lastSaved.quantity;
      }
    }      
    let costs = this.calcCosts(this.selectionArray[c][i]);
    this.selectionArray[c][i].costs = [costs[0],costs[1],costs[2]];
    this.saveItemDetails(this.selectionArray[c][i]); // save/update itemDetails object in project
  }

  changeQuantity(i: number, c: number) {
    let selection = this.selectionArray[c][i]; // existing object in array
    console.log("Quantity for " + selection.type + " changed to " + selection.quantity);
      // update other properties with last saved info
      if ((selection.quantity > 0 && !selection.checked) || (selection.quantity < 0 && selection.checked)) {
        let lastSaved: Selection = this.createSelectionObject(selection.type, selection.category);
        this.selectionArray[c][i].checked = true;
        this.selectionArray[c][i].selected = lastSaved.selected; // this may be null
        if (selection.quantity < 0) {
          this.selectionArray[c][i].quantity = lastSaved.quantity; // set back to last saved if accidentally set to negative while checked
        }
        if (lastSaved.selected !== null) {
          this.selectionArray[c][i].costs = [lastSaved.costs[0],lastSaved.costs[1],lastSaved.costs[2]];
          this.saveItemDetails(this.selectionArray[c][i]); // save/update itemDetails object in project
        } // otherwise do not calculate costs or save itemDetails here because item has not yet been selected from options (still null)
    } else if (selection.quantity <= 0) {
        this.resetSelection(selection); // but do not overwrite corresponding itemDetails object yet
    } else if (selection.selected !== null) { // quantity is being raised from 1 or higher
        let costs = this.calcCosts(this.selectionArray[c][i]);
        this.selectionArray[c][i].costs = [costs[0],costs[1],costs[2]];
        this.saveItemDetails(this.selectionArray[c][i]); // update itemDetails object in project
    } // otherwise do not calculate costs or save itemDetails here because item has not yet been selected from options (still null)
  }
 
  /***** SAVE ITEM DETAILS TO PROJECT EACH TIME VALUE IS CHANGED IN FORM *****/

  // save one itemDetails object at a time with selection info
  saveItemDetails(selection: Selection) {

    if (selection.checked) { 
      // check to see if itemDetails object already exists
      let index = this.lookUpDetailsByType(selection.type);
      if (index >= 0) {
        this.project.itemDetails[index].itemId = selection.selected.id; // overwrite itemId
        this.project.itemDetails[index].quantity = selection.quantity; // overwrite quantity
        console.log("ItemDetails object for " + selection.type + " updated to " + selection.selected.name + " and quantity " + selection.quantity);
      } else {
        // TODO: what happens if selection.selected is null
        let details = new ItemDetails(selection.selected.id); // create object and set itemId property
        details.quantity = selection.quantity; // set quantity
        this.project.itemDetails.push(details);
        console.log("ItemDetails object for " + selection.type + " added to project");
      }
      this.buildEstimate(selection);
    }
    // unchecked items will be handled in buildProject() at form submission
  } 

  // reset checkbox, select dropdown, and quantity fields all at once
  resetSelection(selection: Selection) {
    selection.checked = false;
    selection.selected = null;
    selection.quantity = 0;
    selection.costs = [0,0,0];
    // TODO: recalculate estimate totals 
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
    console.log(type + " was deselected and all its values reset in project.itemDetails array");
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

    // TODO: maybe call function to calculate estimate here?
  }

  // calculate for each selected item based on quantity or measurements

  // TODO: if lower cabinets are recalculated, countertop and backsplash need to be updated too (and their respective impacts on materials and labor)
  calcCosts(selection: Selection): number[] {
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


  /***** CALCULATE ESTIMATE *****/

  // TODO: need to switch over to a function that calculates the estimate totals for each category from
  // scratch every time a change is made (since continuing to add on will inflate indefinitely)

  // TODO: need getSubtotal(c) specifically for three categories iterated through

  // build estimate object as each item is calculated
  buildEstimate(selection: Selection) {

    // check item for category and add cost to matching subtotal
    if (selection.category === 'appliance') {
      this.project.estimate.appliancesCost += selection.costs[0];
    } else if (selection.category === 'fixture') {
      this.project.estimate.fixturesCost += selection.costs[0];
    } else if (selection.category === 'finish') {
      this.project.estimate.finishesCost += selection.costs[0];
    }
    console.log("Cost for " + selection.type + " item added to estimate: " + selection.costs[0]);

    // add any related materials cost - will add in only once if appliance involveds both plumbing & electrical
    if ((this.project.materials.needPlumbingSystem === true && this.factorIntoPlumbing.includes(selection.type)) 
      || (this.project.materials.needElectricalSystem === true && this.factorIntoElectrical.includes(selection.type))) {
        // Note: framing and drywall costs added separately since not tied to specific items, just dimensions of room
        this.project.estimate.materialsCost += selection.costs[1];
      console.log("Cost for " + selection.type + " rough materials added to estimate: " + selection.costs[1]);
    }

    // add any related labor cost - will add in only once if appliance involves both plumbing & electrical
    if ((this.project.labor.needPlumbingSub === true && this.factorIntoPlumbing.includes(selection.type)) 
      || (this.project.labor.needElectricalSub === true && this.factorIntoElectrical.includes(selection.type))
      || (this.project.labor.needFinishWork === true && this.factorIntoFinishWork.includes(selection.type))) {
      // Note: rough carpentry labor costs added separately since not tied to specific items, just dimensions of room
      this.project.estimate.laborCost += selection.costs[2];
      console.log("Cost for " + selection.type + " labor added to estimate: " + selection.costs[2]);
    }
    
  }

  // if room measurements are changed, update estimate amounts that depend on them
  updateMaterialAndLabor() {
    if (this.project.materials.needFraming === true) {
      this.project.estimate.materialsCost += 10 * this.wallArea; // $10/SF of wall area
    }
    if (this.project.materials.needDrywall === true) {
      this.project.estimate.materialsCost += 25 * this.wallArea; // $25/SF of wall area
    }
    if (this.project.labor.needRoughCarpentry === true) {
      this.project.estimate.laborCost += 10 * this.wallArea; // $10/SF of wall area
    }
    console.log("Dimension-related material and labor costs updated in estimate");
  }

  // add together all subtotals for estimate based on current calculations
  updateEstimateTotal() {
    this.project.estimate.totalCost = this.project.estimate.appliancesCost +
                              this.project.estimate.fixturesCost +
                              this.project.estimate.finishesCost +
                              this.project.estimate.materialsCost +
                              this.project.estimate.laborCost;
  }


  /***** SAVE PROJECT *****/

  // called only when submit button is clicked - processes input and sends everything to database
  saveProject() {

    let selection: Selection;
    let index: number;

    // TODO: right now if editing previous estimate, original selections are being lost upon save
    // reset any types that may have existed in itemDetails before but were unchecked at submission
    for (let c=0; c < 3; c++) { // once for each category subarray of selectionArray
      for (let i=0; i < this.selectionArray[c].length; i++) {
        selection = this.selectionArray[c][i];
        index = this.lookUpDetailsByType(selection.type);
        if (index >= 0 && ! selection.checked) { 
          this.resetItemDetails(index, selection.type);
        } 
      }
    }

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

    // carry project id forward to view estimate
    if (this.project.id !== Number(this.tokenStorageService.getProject())) {
      this.tokenStorageService.saveProject(this.project.id);
    }
    this.router.navigate(['/project/list/']);

  }

}
