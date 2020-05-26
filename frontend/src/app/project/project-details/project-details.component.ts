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

  selectionArray: Selection[] = []; // for facilitating data binding with item selections in form

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
          let item = new Item(obj.id, obj.name, obj.room, obj.category, obj.type, obj.price, obj.roughMaterials, obj.labor);
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
      this.selectionArray = [];
      let item: Item;
      for (let j=0; j < this.itemsArray.length; j++) {
        item = this.itemsArray[j];
        if (item.room.includes(this.project.roomType) && this.findSelectionByType(item.type) === -1) {
          let selection = this.createNewSelection(item);
          this.selectionArray.push(selection);
        }
      }
      this.selectionArray.sort((a, b) => (a.type > b.type) ? 1 : -1);
      this.changedRoom = false;
      this.firstLoad = false;
      this.dataLoaded = true; // allow page to render - FIXME: not 100% sure this fixed the issue
    }
  }
  
  // for each type, build a list of available options to display for dropdown lists
  getOptions(itemType: string): Item[] {
    let optionsArray = [];
    let item: Item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.type === itemType && item.room.includes(this.project.roomType)) {
        optionsArray.push(item); // IMPORTANT: the array is now built of items, not just their names
      }
    }
    optionsArray.sort((a, b) => (a.name > b.name) ? 1 : -1);
    return optionsArray;
  }

  // FOR RENDERING FORM - returns either last saved info or a blank Selection object
  createNewSelection(item: Item): Selection {
    let index = this.lookUpDetailsByType(item.type);
    if (index >= 0) { // an itemDetails object already exists for this type
      let details: ItemDetails = this.project.itemDetails[index];
      console.log("Value for", item.type,"was last saved as", item.name);
      return new Selection(item.category, item.type, true, item, details.quantity); 
    } else { // project does not have an ItemDetails object for this type
      console.log("Created new Selection object for type", item.type);
      return new Selection(item.category, item.type, false); // default to initialized values for 'id', 'selected' & 'quantity'
    }
  }

  // UPON ACTIVE SELECTION - returns either last saved info or a new Selection object with defaults
  getSavedDetails(selection: Selection): Selection {
    let item: Item;
    let quantity: number;
    let index = this.lookUpDetailsByType(selection.type);
    if (index >= 0) { // an itemDetails object already exists for this type
      let details: ItemDetails = this.project.itemDetails[index];
      item = this.itemsArray[this.findItemById(details.itemId)];
      console.log("Value for", item.type,"was last saved as", item.name);
      return new Selection(item.category, item.type, true, item, details.quantity); 
    } else { // no previous itemDetails object exists for this type
      // default to first possible option for selected item
      item = this.getOptions(selection.type)[0];      
      // if this type needs a quantity, set it to 1 the first time
      if (this.calcByQuantity.includes(selection.type)) {
        quantity = 1;
      } else {
        quantity = 0;
      }
      console.log("Value for", selection.type, "has defaulted to", item.name, "with a quantity of ", quantity);
      return new Selection(selection.category, selection.type, true, item, quantity); 
    }
  }



  /***** EVENT HANDLERS FOR ITEM SELECTIONS *****/

  /** The corresponding itemDetails object will not actually be updated unless positive changes are made;
   * if deselected/zeroed, all three fields will blank out but the itemDetails object will retain
   * the previous selections in case the user changes their mind prior to submitting the form.
   */

  changeChecked(selection: Selection, i: number) {
    console.log(selection.type, (selection.checked ? "checked" : "unchecked"));
    if (selection.checked) {
      // get either last info saved in itemDetails or defaults
      let lastSaved: Selection = this.getSavedDetails(selection); 
      // update other two fields with this info
      this.selectionArray[i].selected = lastSaved.selected;
      this.selectionArray[i].quantity = lastSaved.quantity;
      this.saveItemDetails(this.selectionArray[i]); // save/update itemDetails object in project
    } else {
      this.resetAll(selection); // but do not overwrite corresponding itemDetails object yet
    }  
	}

  // when selection is made in middle column, force checked and quantity
  changeSelected(selection: Selection, i: number) {  // FIXME: not bringing in .selected value for selection
    console.log(selection.type, "selected:", selection.selected.name); 
    if (selection.checked === false) {
      this.selectionArray[i].checked = true;
    }    
    if (this.calcByQuantity.includes(selection.type) && selection.quantity === 0) {
      this.selectionArray[i].quantity = 1;
    }
    this.saveItemDetails(this.selectionArray[i]); // save/update itemDetails object in project
  }

  changeQuantity(selection: Selection, i: number) {
    console.log("Quantity for", selection.type, "changed to", selection.quantity);
    // force other fields to sync up if quantity increased (but not checked) or negative number input
    if ((selection.quantity > 0 && !selection.checked) || (selection.quantity < 0 && selection.checked)) {
      this.selectionArray[i].checked = true;
      let lastSaved: any = this.getSavedDetails(selection);
      this.selectionArray[i].selected = lastSaved.selected;
      this.saveItemDetails(this.selectionArray[i]); // save/update itemDetails object in project
    } else if (selection.quantity <= 0) {
      this.resetAll(selection); // but do not overwrite corresponding itemDetails object yet
    } else { // if quantity is being raised from 1 or more
      this.saveItemDetails(this.selectionArray[i]); // save/update itemDetails object in project
    }

  }
 
  /***** SAVE ITEM DETAILS TO PROJECT EACH TIME VALUE IS CHANGED IN FORM *****/

  // save one itemDetails object at a time with selection info
  saveItemDetails(selection: Selection) {
    if (selection.checked) { 

      // TODO: (maybe) un-comment if adding functionality to display line item cost dynamically
      // let costs = this.calculateCosts(selection); // costs for item, rough materials, and labor

      // check to see if itemDetails object already exists
      let index = this.lookUpDetailsByType(selection.type);
      if (index >= 0) {
        this.project.itemDetails[index].itemId = selection.selected.id; // overwrite itemId
        this.project.itemDetails[index].quantity = selection.quantity; // overwrite quantity
        // TODO: (maybe) un-comment if adding functionality to display line item cost dynamically
        // this.project.itemDetails[index].finalPrice = costs[0];
        console.log("ItemDetails object for", selection.type, "updated to", selection.selected.name, "and quantity", selection.quantity);
      } else {
        let details = new ItemDetails(selection.selected.id); // create object and set itemId property
        details.quantity = selection.quantity; // set quantity
        // TODO: (maybe) un-comment if adding functionality to display line item cost dynamically
        // details.finalPrice = costs[0]; // set finalPrice
        this.project.itemDetails.push(details);
        console.log("ItemDetails object for", selection.type, "added to project.");
      }
      // TODO: (maybe) un-comment if adding functionality to display line item cost dynamically
      // this.buildEstimate(item, selection, costs);
    } else {
      // if unchecked...
      // TODO: this function should only be called for unchecked items at the point of entering the edit project block or when submitting form and saving the entire project 
    }
  }

  // reset checkbox, select dropdown, and quantity fields all at once
  resetAll(selection: Selection) {
    selection.checked = false;
    selection.selected = null;
    selection.quantity = 0;
    console.log("All input fields for", selection.type, "reset.");
    // DO NOT save to corresponding itemDetails object inside this function
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
  findSelectionByType(type: string): number {
    let selection: Selection;
    for (let i=0; i<this.selectionArray.length; i++) {
      selection = this.selectionArray[i];
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
        item = this.itemsArray[this.findItemById(details.itemId)];
        if (item.type === type) {
          return i;
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
    console.log("Project measurements set from room dimensions.");
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
      materialCost = selection.quantity * item.roughMaterials;
      laborCost = selection.quantity * item.labor;
      console.log(item.type, "calculated by quantity.");
    } else if (this.calcByLF.includes(item.type)) {
      itemCost = this.perimeter * item.price;
      materialCost = this.perimeter * item.roughMaterials;
      laborCost = this.perimeter * item.labor;
      console.log(item.type, "calculated by linear feet.");
    } else if (this.calcByCabinet.includes(item.type)) {
      let index: number = this.findSelectionByType("Cabinets, Lower");
      let cabinet: Selection = this.selectionArray[index];
      itemCost = cabinet.quantity * 2 * item.price; // FIXME: if no lower cabinets have beens selected, this will result in 0 (for now)
      materialCost = cabinet.quantity * item.roughMaterials;
      laborCost = cabinet.quantity * item.labor;
      console.log(item.type, "calculated by number of cabinets.");
    } else if (item.type === "Wall") {
      itemCost = this.wallArea * item.price;
      materialCost = this.wallArea * item.roughMaterials;
      laborCost = this.wallArea * item.labor;
      console.log(item.type, "calculated by wall area.");
    } else if (item.type === "Flooring") { 
      itemCost = this.floorArea * item.price;
      materialCost = this.floorArea * item.roughMaterials;
      laborCost = this.floorArea * item.labor;
      console.log(item.type, "calculated by floor area.");
    } else {
      console.log(item.type, "not categorized for calculation."); // debug
    }
    costs = [itemCost, materialCost, laborCost];
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
    console.log("Cost for", selection.type, "item added to estimate:", costs[0]);

    // add any related materials cost - will add in only once if appliance involveds both plumbing & electrical
    if (this.project.materials.needPlumbingSystem === true && this.factorIntoPlumbing.includes(selection.type)) {
      this.project.estimate.materialsCost += costs[1];
    } else if (this.project.materials.needElectricalSystem === true && this.factorIntoElectrical.includes(selection.type)) {
      this.project.estimate.materialsCost += costs[1];
    }
    // Note: framing and drywall costs added separately since not tied to specific items, just dimensions of room
    console.log("Cost for", selection.type, "rough materials added to estimate:", costs[1]);

    // add any related labor cost - will add in only once if appliance involves both plumbing & electrical
    if (this.project.labor.needPlumbingSub === true && this.factorIntoPlumbing.includes(selection.type)) {
      this.project.estimate.laborCost += costs[2];
    } else if (this.project.labor.needElectricalSub === true && this.factorIntoElectrical.includes(selection.type)) {
      this.project.estimate.laborCost += costs[2];
    }
    // Note: rough carpentry labor costs added separately since not tied to specific items, just dimensions of room
    if (this.project.labor.needFinishWork === true && this.factorIntoFinishWork.includes(selection.type)) {
      this.project.estimate.laborCost += costs[2];
    }
    console.log("Cost for", selection.type, "labor added to estimate:", costs[2]);
  
  }



  // BUILD PROJECT

  buildProject() {

    this.project.itemDetails = []; // reset project's itemDetails array to remove any prior saved objects and values
    let selection: Selection;
    let index: number;
    let details: ItemDetails;
    let costs: number[];

    // if selected in form, itemDetails object should already be updated

    for (let i=0; i < this.selectionArray.length; i++) {
      selection = this.selectionArray[i];
      index = this.lookUpDetailsByType(selection.type); // look for this type in the project itemDetails array
      if (selection.checked) { 
        details = this.project.itemDetails[index];
        // itemDetails object will already have been updated - just need associated costs
        costs = this.calculateCosts(selection); // costs for item, rough materials, and labor
        details.finalPrice = costs[0]; // set finalPrice
        console.log("ItemDetails object for", selection.type, "updated with cost.")   
        this.buildEstimate(selection, costs); // add per-item additional costs into estimate
        console.log("Estimate updated with costs associated with selection for", selection.type);
      } else if (index >= 0) { // if unchecked and itemDetails object for this type exists from prior selection, reset data
          this.project.itemDetails[index].itemId = null;
          this.project.itemDetails[index].quantity = 0;
          this.project.itemDetails[index].finalPrice = 0;
      } // otherwise skip type
    }

    // COMPLETE ESTIMATE - add remaining material & labor costs based on room dimensions, not items
    if (this.project.materials.needFraming === true) {
      this.project.estimate.materialsCost += 10 * this.wallArea; // $10/SF of wall area
    }
    if (this.project.materials.needDrywall === true) {
      this.project.estimate.materialsCost += 25 * this.wallArea; // $25/SF of wall area
    }
    if (this.project.labor.needRoughCarpentry === true) {
      this.project.estimate.laborCost += 10 * this.wallArea; // $10/SF of wall area
    }
    console.log("Remaining material and labor costs added to estimate.");

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

    // TODO: verify all project properties are saving to back end

    // save project to database
    fetch("http://localhost:8080/api/project/" + this.project.id, {
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
