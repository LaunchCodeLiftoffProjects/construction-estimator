import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  url = "http://localhost:8080/api/project";
  projects: Project[];

  constructor() { }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    fetch(this.url).then(function(response) {
      response.json().then(function(json) {
        let refreshProjects: Project[] = [];
        json.forEach(obj => {
          refreshProjects.push(new Project(obj.id, obj.name, obj.roomTypoe, obj.roomLength, obj.roomWidth, obj.RoomHeight));
        });
        this.projects = refreshProjects;
      }.bind(this));
    }.bind(this));
  }

}
