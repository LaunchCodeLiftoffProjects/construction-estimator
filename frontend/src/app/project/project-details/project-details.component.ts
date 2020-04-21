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
    this.loadItems();
    // console.log("Items Loaded", this.itemsArray[0].name);
    this.loadProject();
    console.log("Project Loaded");
    
  }


  loadProject() {

    
    fetch(this.projectURL).then(function(response) {
      response.json().then(function(json) {
        this.project = new Project(json.name, json.roomType, json.roomLength, json.roomWidth, json.roomHeight);
        this.project.id = json.id;
        // console.log("", this.project.name);
      }.bind(this));
    }.bind(this));

  }

  loadItems() {

    fetch("http://localhost:8080/api/item").then(function(response) {
      response.json().then(function(json) {
        let detailsArray: ItemDetails[] = [];
        json.forEach(obj => {
          this.project.itemDetails.push(new ItemDetails(this.project, new Item(obj.id, obj.name, obj.description, obj.price, obj.category, obj.roomTypes)));
        });
        // this.project.itemDetails = detailsArray;
        
      }.bind(this));
    }.bind(this));
    

  }




  saveItemDetails(quantity: number, itemDetailsObject: ItemDetails) {
      itemDetailsObject.quantity = quantity;
      console.log("changed quantity of " + itemDetailsObject.item.name + "and added it to the Project ItemDetails array", itemDetailsObject);
  }



  saveProjectDetails() {
  
    fetch('http://localhost:8080/api/project/{this.projectId}/component', {
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

  }


}
