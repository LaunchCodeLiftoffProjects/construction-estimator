import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/project';
import { Item } from 'src/app/item';
import { ProjectComponent } from 'src/app/projectcomponent';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  // NEED A WAY TO ACCESS THE PROJECT ID project = ;
  url = "http://localhost:8080/api/item";
  items: Item[];
  categories = ["fixture", "appliance", "finish"];
  projectComponents: ProjectComponent[];

  constructor() { }

  ngOnInit() {
    this.loadItems();
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



  saveProjectComponent(project: Project, item: Item, quantity: number) {
    let projectComponent = new ProjectComponent(project, item, quantity, item.price*quantity);
    this.projectComponents.push(projectComponent);
    console.log("saved projectComponent to an array", projectComponent);
    
}


  saveProjectDetails(projectId: number) {
    // TODO: POST TO SERVER
    fetch('http://localhost:8080/api/project/{projectId}/component', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(this.projectComponents),
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log('Success:', data);
    }).catch(function(error) {
      console.error('Error:', error);
    });

  }


}
