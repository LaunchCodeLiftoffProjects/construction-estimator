import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/project';
import { Item } from 'src/app/item';
import { ItemDetails } from 'src/app/item-details';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  // NEED A WAY TO ACCESS THE PROJECT ID project = ;
  projectId: number;
  url = "http://localhost:8080/api/item";
  projectURL = "http://localhost:8080/api/project" + this.projectId;
  items: Item[];
  categories = ["fixture", "appliance", "finish"];
  kitchenItems = ["stove", "refrigerator"];
  bedroomItems = [];
  bathroomItems = [];
  itemDetails: ItemDetails[];
  project: Project;

  constructor() { }

  ngOnInit() {
    this.loadItems();
    this.loadProject();
  }

  loadProject() {
    fetch(this.projectURL).then(function(response) {
      response.json().then(function(json) {
        json.forEach(obj => {
          this.project = new Project(obj.name, obj.roomType, obj.roomLength, obj.roomWidth, obj.roomHeight);
          this.itemDetails = obj.itemDetails;
          this.projectId = obj.id;
        });
      }.bind(this));
    }.bind(this));
  }


  loadItems() {
    fetch(this.url).then(function(response) {
      response.json().then(function(json) {
        let refreshItems: Item[] = [];
        json.forEach(obj => {
          refreshItems.push(new Item(obj.id, obj.name, obj.description, obj.price, obj.category));
        });
        this.items = refreshItems;
      }.bind(this));
    }.bind(this));
  }



//   saveItemDetails(quantity: number) {
//     for () {
      
//     }
//     this.itemDetails;
//     console.log("saved projectComponent to an array", itemDetails);
    
// }


  saveProjectDetails() {

    // TODO: POST TO SERVER
    fetch('http://localhost:8080/api/project/{this.projectId}/component', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(this.itemDetails),
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log('Success:', data);
    }).catch(function(error) {
      console.error('Error:', error);
    });

  }


}
