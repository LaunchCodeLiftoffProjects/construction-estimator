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

  constructor(private route: ActivatedRoute) { }


  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");

    console.log("Id", this.id);

    this.projectURL = this.projectURL + this.id;
    this.loadProject();
    console.log("Project Loaded");
    this.loadItems();
    console.log("Items loaded.");
  }


  loadProject() {

    fetch(this.projectURL).then(function(response) {
      response.json().then(function(json) {
        this.project = new Project(json.name, json.roomType, json.roomLength, json.roomWidth, json.roomHeight);
        this.project.id = json.id;
        this.project.itemDetails = json.itemDetails;
      }.bind(this));
    }.bind(this));

  }

  loadItems() {

    fetch("http://localhost:8080/api/item").then(function(response) {
      response.json().then(function(json) {
        let detailsArray: ItemDetails[] = [];
        let item: Item;
        let itemDetails: ItemDetails;
        this.itemsArray = [];
        json.forEach(obj => {
          item = new Item(obj.id, obj.name, obj.description, obj.price, obj.category, obj.room);
          console.log(item);
          this.itemsArray.push(item);
          // itemDetails = new ItemDetails(this.project, item);
          // detailsArray.push(itemDetails);
        });
        // this.project.itemDetails = detailsArray;
      }.bind(this));
    }.bind(this));
    

  }




  saveItemDetails(quantity: number, itemDetailsObject: ItemDetails) {
      itemDetailsObject.quantity = quantity;
      console.log("changed quantity of " + itemDetailsObject.item.name + "and added it to the Project ItemDetails array", itemDetailsObject);
  }


  updateProjectName(name: string) {
    this.project.name = name;
    console.log("changed project name:", this.project.name);
  }

  updateProjectRoomType(event: any) {
    this.project.roomType = event.target.value;;
    console.log("changed project room type:", this.project.roomType);
  }

  updateProjectRoomLength(roomLength: string) {
    this.project.roomLength = name;
    console.log("changed project room length:", this.project.roomLength);
  }

  updateProjectRoomWidth(roomWidth: string) {
    this.project.roomWidth = name;
    console.log("changed project room width:", this.project.roomWidth);
  }

  updateProjectRoomHeight(roomHeight: string) {
    this.project.roomHeight = name;
    console.log("changed project room height:", this.project.roomHeight);
  }



  saveProjectDetails() {
  
    fetch("http://localhost:8080/api/project/" + this.project.id + "/component", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(this.project.itemDetails),
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log('Success:', data);
    }).catch(function(error) {
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
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log('Success:', data);
    }).catch(function(error) {
      console.error('Error:', error);
    });

  }


}
