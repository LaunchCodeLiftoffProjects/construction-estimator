import { Component, OnInit } from '@angular/core';
import { Project } from '../../project';

import { Router, RouterModule, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  id: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
 
  }

  saveProject(name: string, roomType: string, roomLength: number, roomWidth: number, roomHeight: number) {
    let project = new Project(name, roomType, roomLength, roomWidth, roomHeight);
    console.log("saved project", project);
    // TODO: POST TO SERVER
    fetch('http://localhost:8080/api/project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(project),
    }).then(function(response) {
      // get id number from response here { id: idNumber }
      response.json().then(function(json) {
        this.id = json.id;
        console.log("json id", this.id);
      })
    }).then(function(data) {
      console.log('Success:', data);
    }).catch(function(error) {
      console.error('Error:', error);
    });
    this.router.navigate(["/project/add-details/", this.id]);
  }
}
