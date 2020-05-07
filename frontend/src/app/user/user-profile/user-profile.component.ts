import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';
import { ActivatedRoute } from '@angular/router';
// import { userInfo } from 'os';S
import { UserDetails } from 'src/app/user-details';

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
  editUser: boolean = false;
  editDetails: boolean = false;

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
        this.user.id = json.id;
        console.log(this.user);

        this.loadCompleted = true;
      }.bind(this));
    }.bind(this));
  }

  editProfile() {
    this.editUser = true;
  }

  editHomeDetails() {
    this.editDetails = true;
  }

  onEditUserClose() {
    console.log("event received");
    this.editUser = false;
  }

}
