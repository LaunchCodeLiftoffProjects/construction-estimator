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
  editingProject: boolean = false; // for editing basic project info at top right of page

  itemsArray: Item[]; // to get all possible items (serves dual purpose - display and data for calculations)

  categories = [ "appliance", "fixture", "finish" ];
  categoryTitles = [ "Appliances", "Fixtures", "Finishes" ];

  needsQuantity: string[] = ['Dishwasher','Disposal','Microwave/Hood','Oven/Range','Refrigerator',
              'Bath & Shower', 'Ceiling Light/Fan', 'Electrical Outlets', 'Electrical Switches', 
              'Lighting', 'Sink', 'Specialty', 'Toilet', 'Doors', 'Lower Cabinets', 'Upper Cabinets', 
              'Windows'];

  currentID: number = 1;
  
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
        this.loadItems(); // should problem move this to ngOnInit() since it is independent of project object
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

  // get all possible items that could be displayed and selected
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

  // for each roomType and category, build a list of unduplicated types to display
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
  getOptions(itemType: string, itemRoom: string) {
    let optionsArray = [];
    let item: Item;
    for (let i=0; i < this.itemsArray.length; i++) {
      item = this.itemsArray[i];
      if (item.type === itemType && item.room.includes(itemRoom)) {
        optionsArray.push(item);
      }
    }
    optionsArray.sort((a, b) => (a.name > b.name) ? 1 : -1);
    return optionsArray;
  }

  // display last selection for each type if editing formerly estimated project
  // getItem(itemType): [Item, ItemDetails] {
  //   let item: Item;
  //   let details: ItemDetails;
  //   if (this.project.itemDetails.length !== 0) {
  //     for (let i=0; i < this.itemsArray.length; i++) {
  //       for (let j=0; j < this.project.itemDetails.length; j++) {
  //         item = this.itemsArray[i];
  //         details = this.project.itemDetails[j]
  //         // check items in itemsArray with current type against item IDs saved in project.itemDetails
  //         if (item.type === itemType && item.id === details.itemId) {
  //           // return item (to get name for option dropdown) and itemDetails (to get quantity)
  //           return [item, details];
  //         }
  //       }
  //     } 
  //   } else {
  //     return [null, null]; 
  //   }
  // }

  // getCheckStatus(itemType: string): boolean { 
  //     if (this.getItem(itemType)[0] === null) {
  //       return false;
  //     } else {
  //       return true
  //   }
  // }

  // THIS IS NOT WORKING - need different approach (most research says to use ngModel but...)
  // getSelection(itemType: string): string {
  //   let result = this.getItem(itemType);
  //   if (result[0] !== null) {
  //     return "(Select an option)";
  //   } else {
  //     return result[0].name;
  //   }
  // }

  // getQuantity(itemType: string): number {
  //   let result = this.getItem(itemType);
  //   if (result[1] === null) {
  //     return 0;
  //   } else {
  //     return result[1].quantity;
  //   }
  // }


  
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

  //get fresh ID number for new ItemDetails items - can't remember how this is supposed to happen otherwise
  getID(): number {
    this.currentID++;
    return this.currentID;
  }

  // if checked, make sure ItemDetails object is included in selected Array - if unchecked, remove from array
  includeItem(itemType: string, checked: boolean) {
    console.log(itemType, "checked:", checked);
    let existingDetails: ItemDetails = this.findItemDetails(itemType);
    if (existingDetails !== null && checked === false) {
      this.project.itemDetails.splice(this.project.itemDetails.indexOf(existingDetails), 1); // remove object from array in project
      console.log("removed", itemType, "from project");
    } else if (existingDetails === null && checked === true) {
      let newDetails: ItemDetails = new ItemDetails(this.getID()); // values for properties will be added elsewhere
      this.project.itemDetails.push(newDetails); // add object to array in project
      console.log("added", itemType, "to project")
    } 
  }

  // save itemID of the selected Item object to the ItemDetails array in the project
  // need to validate form so that it won't submit if a type is checked but an option hasn't been selected
  setSelection(itemType: string, selection: string) {
    console.log("selected option ", selection, "for", itemType);
    let existingDetails: ItemDetails = this.findItemDetails(itemType);
    let item = this.getItemByTypeAndName(itemType, selection);
    let index = this.project.itemDetails.indexOf(existingDetails);
    this.project.itemDetails[index].itemId = item.id; // set itemID to itemDetails object in project
    console.log("set item ID for", selection, "to itemDetails in project");
  }

  // get quantity if required for calculation
  setQuantity(itemType: string, quantity: number) {
    console.log("user input quantity of", quantity, "for", itemType);
    let existingDetails: ItemDetails = this.findItemDetails(itemType);
    let index = this.project.itemDetails.indexOf(existingDetails);
    this.project.itemDetails[index].quantity = quantity; // set quantity to itemDetails object in project
    console.log("set quantity for", itemType, "to itemDetails in project");
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
    // NOTE: This needs to be replaced with Shaun's newer PUT function
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
