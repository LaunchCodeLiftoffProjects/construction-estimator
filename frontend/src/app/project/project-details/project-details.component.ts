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
  editingProject: boolean = false; // for editing basic project info at top right of page
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  userId: number;
  changedDimensions = 0;

  itemsArray: Item[]; // to get all possible items (serves dual purpose - display and data for calculations)

  rooms: string[] = [ "kitchen", "bath", "living" ];
  roomTitles: string[] = [ "Kitchen", "Bathroom", "Bedroom/Living/Other" ];
  categories: string[] = [ "appliance", "fixture", "finish" ];
  categoryTitles = [ "Appliances", "Fixtures", "Finishes" ];

  calcByQuantity: string[] = ['Dishwasher','Disposal','Microwave/Hood','Oven/Range','Refrigerator',
              'Bath & Shower', 'Ceiling Light/Fan', 'Electrical Outlets', 'Electrical Switches',
              'Lighting', 'Shelving', 'Sink', 'Toilet', 'Doors', 'Cabinets, Lower', 'Cabinets, Upper',
              'Windows'];
  calcByLF: string[] = ['Backsplash','Baseboards','Countertop','Trim'];
  calcBySF: string[] = ['Flooring','Specialty','Walls'];


  selectionArray: Selection[] = []; // for facilitating data binding with item selections

  // materials: Materials;
  // labor: Labor;
  materials: Materials = new Materials; // had to initialize to new instance because project object is bringing null objects
  labor: Labor = new Labor; // had to initialize to new instance because project object is bringing null objects

  estimate: Estimate = new Estimate; // not needed for modeling but for calculations

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


  // GET EXISTING PROJECT

  // get project object from database (and any saved information from previous session if not first time)
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
      if (item.room.includes(this.project.roomType) && this.locateSelection(item) === -1) {
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


  // CALCULATE ESTIMATE

  // use data from original JSON file of all items to calculate for each selected item
  calculateFinalPrice(item: Item, selection: Selection): number {
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
