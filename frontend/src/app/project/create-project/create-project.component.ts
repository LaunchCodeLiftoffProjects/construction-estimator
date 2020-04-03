import { Component, OnInit } from '@angular/core';
import { Project } from '../../project';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  saveItem(name: string, type: string, length: number, width: number, height: number) {
    let project = new Project(name, type, length, width, height);
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
      return response.json();
    }).then(function(data) {
      console.log('Success:', data);
    }).catch(function(error) {
      console.error('Error:', error);
    });
  }

}
