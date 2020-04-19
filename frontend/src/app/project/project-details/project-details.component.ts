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



  constructor(
    private route: ActivatedRoute,
    private router: Router) {

     }


  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.projectURL = this.projectURL + id;
    this.loadProject();
  }


  loadProject() {
    fetch(this.projectURL).then(function(response) {
      response.json().then(function(json) {
        let refreshProjectItemDetails = [];
        json.forEach(obj => {
          this.project = new Project(obj.name, obj.roomType, obj.roomLength, obj.roomWidth, obj.roomHeight);
          this.project.itemDetails = [];
          this.project.id = obj.id;
          obj.itemDetails.forEach(itemDetailsObject => {
            if (itemDetailsObject.item.roomTypes.includes(obj.roomType)) {
              refreshProjectItemDetails.push(itemDetailsObject);
            }
          })
          this.project.itemDetails = refreshProjectItemDetails;
        });
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
