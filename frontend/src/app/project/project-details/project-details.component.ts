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
import { ProjectDetailsPayload } from 'src/app/project-details-payload'
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
  editingProject: boolean = false; // for editing basic project info at top right of page
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  userId: number;
  changedDimensions = 0;

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
    console.log("Id", this.id);
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.name;
      this.userId = user.id;
      console.log("id", this.userId);
    } else {
      this.router.navigate(['/login']);
    }
    this.projectURL = this.projectURL + this.id;
    this.loadProject();
    console.log("Project Loaded");
  }


  // GET PROJECT

  // get project object from database (and any saved information from previous session if revising estimate)
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
        this.project.materials = json.materials === null ? new Materials : json.materials;
        this.project.labor = json.labor === null ? new Labor : json.labor;
        this.project.estimate = json.estimate === null ? new Estimate : json.estimate;

        this.setMeasurements(); // calculate perimeter, wall area, and floor area

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
    // TODO: assign selection id number to any types previously saved with project itemDetails
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

  setChecked(selection) {
    if (selection.quantity > 0) {
      selection.checked = true;
      let options = this.getOptions(selection.type);
      return options[0];
    } else if (selection.quantity < 0) {
      selection.quantity = 1;
      return selection.selected;
    } else {
      selection.checked = false;
    }
  }

  setValue(selection) {

    if (selection.checked) {
      let options = this.getOptions(selection.type);
      return options[0];
    } else {
      selection.selected = '';
      selection.quantity = 0;
    }

	}

  // when item selection is checked in form, if zero, raise to 1
  changeQuantity(selection: Selection): number {
    
    if (this.calcByQuantity.includes(selection.type) && selection.checked === true && selection.quantity <= 0) {
      return 1;
    } else {
      return selection.quantity;
    }
  }

  checkValue(selection: Selection) {
    if (selection.checked && selection.quantity <= 0) {
      selection.quantity = 1;
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

  // calculate from dimensions whenever project info loaded or updated
  setMeasurements() {
    this.perimeter = 2 * this.project.roomLength + 2 * this.project.roomWidth;
    this.wallArea = this.perimeter * this.project.roomHeight;
    this.floorArea = this.project.roomLength * this.project.roomWidth;
    console.log("Project measurements set from room dimensions.");
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
      console.log(item.type, "calculated by quantity.");
    } else if (this.calcByLF.includes(item.type)) {
      itemCost = this.perimeter * item.price;
      materialCost = this.perimeter * item.roughMaterials;
      laborCost = this.perimeter * item.labor;
      console.log(item.type, "calculated by linear feet.");
    } else if (this.calcByCabinet.includes(item.type)) {
      let index: number = this.locateSelection("Cabinets, Lower");
      let cabinet: Selection = this.selectionArray[index];
      itemCost = cabinet.quantity * 2 * item.price; // if no lower cabinets have beens selected, this will result in 0
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

  // build estimate object as each item is calculated
  buildEstimate(item: Item, selection: Selection, costs: number[]) {

    // check item for category and add cost to matching subtotal
    if (selection.category === 'appliance') {
      this.project.estimate.appliancesCost += costs[0];
    } else if (selection.category === 'fixture') {
      this.project.estimate.fixturesCost += costs[0];
    } else if (selection.category === 'finish') {
      this.project.estimate.finishesCost += costs[0];
    }
    console.log("Cost for", item.type, "item added to estimate:", costs[0]);

    // add any related materials cost - will add in only once if appliance involveds both plumbing & electrical
    if (this.project.materials.needPlumbingSystem === true && this.factorIntoPlumbing.includes(selection.type)) {
      this.project.estimate.materialsCost += costs[1];
    } else if (this.project.materials.needElectricalSystem === true && this.factorIntoElectrical.includes(selection.type)) {
      this.project.estimate.materialsCost += costs[1];
    }
    // Note: framing and drywall costs added separately since not tied to specific items, just dimensions of room
    console.log("Cost for", item.type, "rough materials added to estimate:", costs[1]);

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
    console.log("Cost for", item.type, "labor added to estimate:", costs[2]);
  
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

    // FIXME: update to match itemDetails and Selection objects by id and update instead of deleting
    // if no longer selected by user in form, zero/blank out data in existing object in database

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
        console.log("ItemDetails object for", selection.type, "added to project.")

        // add per-item costs into estimate
        this.buildEstimate(item, selection, costs);
      }
    }

    // add remaining material & labor costs based on room dimensions, not items
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

    // create ItemDetails array and run calculations for estimate based on user input
    this.buildProject();

    // FIXME: make sure other project properties are saving to back end

    let projectDetailsPayload = new ProjectDetailsPayload(this.project.itemDetails, this.project.labor, this.project.materials, this.project.estimate);

    console.log(JSON.stringify(projectDetailsPayload));

    // save itemDetails objects to database
    fetch("http://localhost:8080/api/project/" + this.project.id + "/details", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Barer ' + this.tokenStorageService.getToken()
      },
      body: JSON.stringify(projectDetailsPayload),
    }).then(function (response) {
      return response;
    }).then(function (data) {
      console.log('Success:', data);
    }).catch(function (error) {
      console.error('Error:', error);
    });

  }


  

}
