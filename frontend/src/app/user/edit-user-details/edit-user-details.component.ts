import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HomeDetails } from 'src/app/home-details';
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
  @Output() onHouseSubmit = new EventEmitter();
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  private roles: string[];
  

  constructor(private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    // this.isLoggedIn = !!this.tokenStorageService.getToken();
    // console.log("token", this.tokenStorageService.getToken());
    // console.log("logged in", this.isLoggedIn);

    // if (this.isLoggedIn) {
    //   const user = this.tokenStorageService.getUser();
    //   this.roles = user.roles;
    
    //   this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
    //   this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');



    // } else {
    //   this.router.navigate(['/login']);
    // }
    
  }


  updateUserDetails(homeAge: number, homeBuild: string, homeNotes: string) {

    if(this.user.homeDetails === null) {
      this.user.homeDetails = new HomeDetails(homeAge, homeBuild, homeNotes);
    } else {
      this.user.homeDetails.homeAge = homeAge;
      this.user.homeDetails.homeBuild = homeBuild;
      this.user.homeDetails.homeNotes = homeNotes;
    }


    fetch(`http://localhost:8080/api/user/${this.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Barer ' + this.tokenStorageService.getToken()
      },
      body: JSON.stringify(this.user),
    }).then(function (response) {

      this.closeEdit();
      return response;

    }.bind(this)).then(function (data) {
      console.log('Success:', data);
    }).catch(function (error) {
      console.error('Error:', error);
    });
  }

  closeEdit() {
    console.log("closing edit");
    this.onHouseSubmit.emit(null);
  }


}
