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


  constructor(
    private route: ActivatedRoute,
    private router: Router) {

     }


  ngOnInit() {
    // this.id = this.route.snapshot.paramMap.get('id');
    // this.route.queryParams.subscribe(params => {
    //   this.id = params['id'];
    // });
    this.project.itemDetails = [];
    this.projectURL = this.projectURL + 15;
    this.loadProject();
  }


  loadProject() {
    
    fetch(this.projectURL).then(function(response) {
      response.json().then(function(json) {
        let refreshProjectItemDetails = [];
        json.forEach(obj => {
          this.project = new Project(obj.name, obj.roomType, obj.roomLength, obj.roomWidth, obj.roomHeight);
          this.project.id = obj.id;
        });
      }.bind(this));
    }.bind(this));



    fetch("http://localhost:8080/api/item").then(function(response) {
      response.json().then(function(json) {
        let detailsArray: ItemDetails[] = [];
        json.forEach(obj => {
          let itemDetails = new ItemDetails(this.project, obj);
          detailsArray.push(itemDetails);
        });
        this.project.itemDetails = detailsArray;
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
