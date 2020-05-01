import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userUrl = "http://localhost:8080/api/user/";
  user: User;
  id: String;
  loadCompleted: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get("id");
    this.userUrl += this.id;

    this.loadUser();
  }

  loadUser() {
    fetch(this.userUrl).then(function(response) {
      response.json().then(function(json) {
        this.user = new User(json.firstName, json.lastName, json.email, json.password, json.userDetails, json.projects);
        console.log(this.user);
        
        this.loadCompleted = true;
      }.bind(this));
    }.bind(this));
  }

}
