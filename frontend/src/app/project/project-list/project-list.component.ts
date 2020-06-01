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
  projects: Project[];
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  selectedProject: Project = null;
  selectedEstimate: Estimate;
  projectId: number = null;

  constructor(private tokenStorageService: TokenStorageService, private router: Router) {
    
   }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.userId = user.id;
      
      this.projectId = Number(this.tokenStorageService.getProject());
  

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
          
          let project = new Project(obj.name, obj.roomType, obj.roomLength, obj.roomWidth, obj.roomHeight);
          project.id = obj.id;
          project.itemDetails = obj.itemDetails;
          project.materials = obj.materials;
          project.labor = obj.labor;
          project.estimate = obj.estimate;
          refreshProject.push(project);
          if (project.id === this.projectId) {
            this.selectedProject = project;
          }
        });
        this.projects = refreshProject;
      }.bind(this));
    }.bind(this));

  }


  setSelectedProject(project) {
    if (this.selectedProject !== project) {
      console.log('selected project', project);
      return project;
    } else {
      return null;
    }
    
  }

  checkSelection(project) {
    if (project === this.selectedProject) {
      return true;
    } else {
      return false;
    }
  }

  deleteProject(projectId:number) {
    fetch(this.projectUrl + '/'+ projectId, {
      method: 'DELETE',
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
          
          let project = new Project(obj.name, obj.roomType, obj.roomLength, obj.roomWidth, obj.roomHeight);
          project.id = obj.id;
          project.itemDetails = obj.itemDetails;
          project.materials = obj.materials;
          project.labor = obj.labor;
          project.estimate = obj.estimate;
          refreshProject.push(project);
          if (project.id === this.projectId) {
            this.selectedProject = project;
          }
        });
        this.projects = refreshProject;
      }.bind(this));
    }.bind(this));
    window.location.reload();
  }

}
