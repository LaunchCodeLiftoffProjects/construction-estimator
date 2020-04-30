import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  userUrl = "http://localhost:8080/api/user";
  user: User[]

  constructor() { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    fetch(this.userUrl).then(function(response) {
      response.json().then(function(json) {
        let refreshUser: User[] = [];
        json.forEach(obj => {
          refreshUser.push(new User(obj.firstName, obj.lastName, obj.email, obj.password, obj.userDetails, obj.projects));
        });
        this.projects = refreshUser;
      }.bind(this));
    }.bind(this));
  }

}
