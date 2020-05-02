import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/project';
import { Item } from 'src/app/item';
import { ItemDetails } from 'src/app/item-details';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';



@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: Project;
  projectURL = "http://localhost:8080/api/project/";
  id: string;
  itemsArray: Item[];
  detailsArray: ItemDetails[];
  editingProject: boolean = false;

  constructor(private route: ActivatedRoute) { }


  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");

    console.log("Id", this.id);

    this.projectURL = this.projectURL + this.id;
    this.loadProject();
    console.log("Project Loaded");

  }


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

  loadItems() {

    fetch("http://localhost:8080/api/item").then(function (response) {
      response.json().then(function (json) {
        this.itemsArray = [];
        // this.detailsArray = [];
        json.forEach(obj => {
          let item = new Item(obj.id, obj.name, obj.room, obj.category, obj.type, obj.price);
          this.itemsArray.push(item);
        });
      }.bind(this));
    }.bind(this));


  }




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

  getQuantity(item:Item): number {
    let detailsIndex = this.project.findItemDetailsByItemId(item.id);

    if (detailsIndex === -1) {
      return 0;
    } else {
      return this.project.itemDetails[detailsIndex].quantity;
    }

  }


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



  saveProjectDetails() {

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
