import { Component, OnInit, Input } from '@angular/core';
import { UserDetails } from 'src/app/user-details';
import { User } from 'src/app/user';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-edit-user-details',
  templateUrl: './edit-user-details.component.html',
  styleUrls: ['./edit-user-details.component.css']
})
export class EditUserDetailsComponent implements OnInit {

  @Input() user: User;
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  private roles: string[];
  

  constructor(private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    console.log("token", this.tokenStorageService.getToken());
    console.log("logged in", this.isLoggedIn);

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
    
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');



    } else {
      this.router.navigate(['/login']);
    }
    if(this.user.userDetails === null) {
      this.user.userDetails = new UserDetails(null, null, null);
    }
  }


  updateUserDetails(homeAge: number, homeBuild: string, homeNotes: string) {
    this.user.userDetails.homeAge = homeAge;
    this.user.userDetails.homeBuild = homeBuild;
    this.user.userDetails.homeNotes = homeNotes;

    fetch(`http://localhost:8080/api/user/${this.user.id}/details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Barer ' + this.tokenStorageService.getToken()
      },
      body: JSON.stringify(this.user.userDetails),
    }).then(function (response) {

      // this.closeEdit();
      return response;

    }.bind(this)).then(function (data) {
      console.log('Success:', data);
    }).catch(function (error) {
      console.error('Error:', error);
    });
  }


}
