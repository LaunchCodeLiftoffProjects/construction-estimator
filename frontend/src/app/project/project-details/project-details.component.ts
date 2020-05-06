import { Component, OnInit, Input } from '@angular/core';
import { Project } from 'src/app/project';
import { Item } from 'src/app/item';
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
  editingProject: boolean = false;

  categories = [ 'appliance', 'fixture', 'finish' ];
  categoryTitles = [ 'Appliances', 'Fixtures', 'Finishes' ];
  needsQuantity: string[] = ['Bath & Shower', 'Ceiling Light/Fan', 'Electrical Outlets', 'Electrical Switches', 'Lighting, Other', 'Sink', 'Specialty', 'Toilet', 'Doors', 'Lower Cabinets', 'Upper Cabinets', 'Windows'];

  isChecked = {}; // maybe
  itemsArray: Item[];
  itemsSelected: Item[]; // to store items from JSON list before calculating and creating ItemDetails objects
  itemDetailsArray: ItemDetails[]; // to store calculated itemDetails objects in project object and save to database
  

  constructor(private route: ActivatedRoute) { }

  @Input() items: Item[];

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
        this.loadItems();
        console.log("Items loaded.");
      }.bind(this));
    }.bind(this));

  }


  // UPDATE BASIC PROJECT INFO AT TOP OF PAGE (IF EDITING)

  updateProjectName(name: string) {
    this.project.name = name;
    console.log("changed project name:", this.project.name);
  }

  updateProjectRoomType(event: any) {
    this.project.roomType = event.target.value;;
    console.log("changed project room type:", this.project.roomType);
  }

  updateProjectRoomLength(roomLength: number) {
    this.project.roomLength = roomLength;
    console.log("changed project room length:", this.project.roomLength);
  }

  updateProjectRoomWidth(roomWidth: number) {
    this.project.roomWidth = roomWidth;
    console.log("changed project room width:", this.project.roomWidth);
  }

  updateProjectRoomHeight(roomHeight: number) {
    this.project.roomHeight = roomHeight;
    console.log("changed project room height:", this.project.roomHeight);
  }


  // GET BASIC ITEMS AND PROPERTIES FOR DISPLAY 

  // gets all possible items that could be displayed
  loadItems() {

    fetch("http://localhost:8080/api/item").then(function (response) {
      response.json().then(function (json) {
        this.itemsArray = [];
        this.detailsArray = []; // what is this for?
        json.forEach(obj => {
          let item = new Item(obj.id, obj.name, obj.room, obj.category, obj.type, obj.price);
          this.itemsArray.push(item);
        });
        this.itemsArray.sort((a, b) => (a.type > b.type) ? 1 : -1);
      }.bind(this));
    }.bind(this));

  }

  // for each roomType and category, build a list of available types to display
  getTypes(itemRoom: string, itemCat: string): string[] {
    let typesArray: string[] = [];
    let item: Item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.room.includes(itemRoom) && item.category === itemCat && ! typesArray.includes(item.type)) {
        typesArray.push(item.type);
      }
  }
    return typesArray;
  }

  // for each type, build a list of available options to display for dropdown lists
  // display last saved options if editing formerly estimated project
  getOptions(itemRoom: string, itemType: string): Item[] {
    let optionsArray = [];
    let item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.type === itemType && item.room.includes(itemRoom)) {
        optionsArray.push(item);
      }
    }
    return optionsArray;
  }

  // get last saved quantity for display if editing formerly estimated project
  getQuantity(item:Item): number {
    let detailsIndex = this.project.findItemDetailsByItemId(item.id);

    if (detailsIndex === -1) {
      return 0;
    } else {
      return this.project.itemDetails[detailsIndex].quantity;
    }

  }


  // UPON FORM SUBMISSION, GATHER SELECTED ITEMS, CALCULATE, AND SAVE TO PROJECT

  // put currently selected items in a temporary array before calculating
  saveItemType(itemType: string, typeSelected: boolean) {
    console.log("I checked the box", itemType, typeSelected);
    this.isChecked[itemType] = typeSelected;
    if (typeSelected) {
      // add item if not checked before
      // remove item if unchecked
    }
  }

  // use data from original JSON file of all items to calculate for selected items
  calculateItemDetails() {
    // calculations not yet written
  }

  // create itemDetails array to save to project
  saveItemDetails(quantity: number, item: Item) {

    // find the itemDetails.itemId index matching item.id
    let detailsIndex = this.project.findItemDetailsByItemId(item.id);

    // check and see if details already exist, if not create a new ItemDetails object
    if (detailsIndex === -1) {
      let newDetails = new ItemDetails(item.id);
      newDetails.quantity = quantity;
      this.project.itemDetails.push(newDetails);
    } else { // the details already exist, update existing quantity
      this.project.itemDetails[detailsIndex].quantity = quantity;
    }
  }

  // create estimate object to save to project
  saveEstimate() {
    // this needs to be added once estimate class is available
  }

  // save itemDetails array and estimate object to project
  // save project to database
  saveProject() {

    // itemDetails
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


    // estimate


    // entire project object
    // The url for this fetch request is not quite right, but we don't yet have a handler for PUT requests to edit the basic project info.
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
