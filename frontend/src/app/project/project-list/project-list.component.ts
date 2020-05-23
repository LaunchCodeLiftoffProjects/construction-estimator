import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';
import { Project } from 'src/app/project';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { Estimate } from 'src/app/estimate';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private router: Router,private tokenStorageService: TokenStorageService) {
    
   }
  activeProject: Project;

  

  ngOnInit() {
    // this. = this.route.snapshot.paramMap.get();
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
    
    this.loadProjects();
  }

  loadProjects() {
    fetch(this.projectUrl).then(function(response) {
      response.json().then(function(json) {
        let refreshProjects: Project[] = [];
        json.forEach(obj => {
          refreshProjects.push(new Project(obj.name, obj.roomType, obj.roomLength, obj.roomWidth, obj.roomHeight));
        });
        this.projects = refreshProjects;
      }.bind(this));
    }.bind(this));
  }
}
//     this.projects = [
//       {
//           name: 'Some Project',
//           itemDetails: [
//               {
//                   item: 'Brackets',
//                   quantity: 6,
//                   finalPrice: 0.30
//               },
//               {
//                 item: 'Wire' ,
//                 quantity: 4,
//                 finalPrice: 0.75
//               }
//           ]
//       }
//   ]
//   }

//   makeActiveProject (project: Project) {
//     this.activeProject = project;
// }
// }
