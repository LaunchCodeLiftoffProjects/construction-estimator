import { Component, OnInit } from '@angular/core';
import { Project } from '../../project';

import { Router, RouterModule, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  project = new Project('', 'kitchen', 0, 0, 0);
  form: any = {};
  id: number;
  selectedRoom: string = "kitchen";
  changedName: boolean = false;
  projectName = "testing";
  changedDimensions: number = 0;
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  greaterThanZero = new FormControl(0, [Validators.max(100000), Validators.min(1)]);


  constructor(private route: ActivatedRoute, private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.name;
    } else {
      this.router.navigate(['/login']);
    }

   
    
  }

  saveProject() {
    let id: number;
    console.log("saved project", this.project);
    fetch('http://localhost:8080/api/project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Barer ' + this.tokenStorageService.getToken()
      },
      body: JSON.stringify(this.project),
    }).then(function(response) {
      // get id number from response here { id: idNumber }
      response.json().then(function(json) {
        //I tried using a forEach loop and the json wasn't gathering the id. I think it's because the one object isn't stored in an array? Not sure though
        this.id = Number(json.id);
        //this project.id gets changed, as it should. I tried using an id field on the component class itself, but I encountered the same issue (see below)
        console.log("json ids", this.id);
        this.router.navigate(['/project/add-details/', this.id]);

      }.bind(this));
    }.bind(this)).then(function(data) {
      console.log('Success:', data);
    }).catch(function(error) {
      console.error('Error:', error);
    });
    //This project.id gets set back to its initial value of undefined. The this.id field did the same thing - it changed and then got reset to 12 on this line.
    // console.log('id assigned', this.project.id);
    //this router link works when the id is given a value before running the fetch, but occassionally it will send you back to the project/create?roomType=whatever which is weird...
  }

  //event handler for the radio button's change event
  updateProjectRoomType (event: any) {
    //update the ui
    this.project.roomType = event.target.value;
  }


  //helps validate room dimensions
  isNumber(val): boolean { 
    return typeof val === 'number'; 
  }
}
