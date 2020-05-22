import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';
import { ActivatedRoute, Router } from '@angular/router';
// import { userInfo } from 'os';S
import { UserDetails } from 'src/app/user-details';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userUrl = "http://localhost:8080/api/user/";
  userId: number;
  loadCompleted: boolean = false;
  editUser: boolean = false;
  editDetails: boolean = false;
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  user: User;

  constructor(private route: ActivatedRoute, private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    //don't need this anymore because the id is sent through the user object 
    // this.id = this.route.snapshot.paramMap.get("id");
    // this.userUrl += this.id;
    

    this.isLoggedIn = !!this.tokenStorageService.getToken();
   

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
    
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.email;
      this.userId = user.id;

      this.loadUser();
    } else {
      this.router.navigate(['/login']);
    }
    
  }
 
  
  loadUser() {
    fetch(this.userUrl + this.userId, {method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Barer ' + this.tokenStorageService.getToken()
      },
    }).then(function(response) {
      response.json().then(function(json) {
        this.user = new User(json.firstName, json.lastName, json.email, json.password, json.userDetails, json.projects);
        this.user.id = json.id;
        console.log("user object", this.user);

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


