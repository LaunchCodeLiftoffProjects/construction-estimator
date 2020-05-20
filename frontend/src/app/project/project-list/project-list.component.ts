import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';
import { Project } from 'src/app/project';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projectUrl = "http://localhost:8080/api/project/";
  id: number;
  project: Project[]

  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit() {
    this.id = this.tokenStorage.getUser().id;
    this.projectUrl += this.id;
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
