import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';
import { Project } from 'src/app/project';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { Router } from '@angular/router';
import { Estimate } from 'src/app/estimate';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projectUrl = "http://localhost:8080/api/project";
  userId: number;
  projects: Project[]
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  selectedProject: Project = null;
  selectedEstimate: Estimate;
  fake = 1;

  constructor(private tokenStorageService: TokenStorageService, private router: Router) {
    
   }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.userId = user.id;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.name;
    } else {
      this.router.navigate(['/login']);
    }
    
    this.loadProject();
  }

  loadProject() {
    fetch(this.projectUrl + "?userId=" + this.userId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Barer ' + this.tokenStorageService.getToken()
      }
    }).then(function(response) {
      response.json().then(function(json) {
        let refreshProject: Project[] = [];
        json.forEach(obj => {
          //FIXME:Right now this loop is not correctly storing the itemDetails, materials, labor, or estimate.
          //The backend is sending the date properly. Even using project.estimate = new Estimate() to get 0s is not working. Data binding is failing.
          let project = new Project(obj.name, obj.roomType, obj.roomLength, obj.roomWidth, obj.roomHeight);
          project.id = obj.id;
          project.itemDetails = obj.itemDetails;
          project.materials = obj.materials;
          project.labor = obj.labor;
          project.estimate = obj.estimate;
          refreshProject.push(project);
        });
        this.projects = refreshProject;
        //TODO:
        //Decide how to grab the project id from the details page
        // this.selectedProject =
      }.bind(this));
    }.bind(this));
  }


  setSelectedProject(project) {
    if (this.selectedProject !== project) {
      if (project.estimate == null) {
        this.selectedProject.estimate = new Estimate();
        return;
      } else {
        this.selectedProject = project;
        return;
      }
    } else {
      this.selectedProject = null;
      return;
    }
    
  }

  checkSelection(project) {
    if (project === this.selectedProject) {
      return true;
    } else {
      return false;
    }
  }



}
