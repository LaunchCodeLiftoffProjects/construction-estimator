import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';
import { Project } from 'src/app/project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projectUrl = "http://localhost:8080/api/project/";
  project: Project[]

  constructor() { }

  ngOnInit() {
    this.loadProject();
  }

  loadProject() {
    fetch(this.projectUrl).then(function(response) {
      response.json().then(function(json) {
        let refreshProject: Project[] = [];
        json.forEach(obj => {
          refreshProject.push(new Project(obj.name, obj.roomType, obj.roomLength, obj.roomWidth, obj.roomHeight));
        });
        this.projects = refreshProject;
      }.bind(this));
    }.bind(this));
  }

}
