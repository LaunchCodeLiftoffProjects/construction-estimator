import { Component, OnInit, Input } from '@angular/core';
import { UserDetails } from 'src/app/user-details';
import { User } from 'src/app/user';

@Component({
  selector: 'app-edit-user-details',
  templateUrl: './edit-user-details.component.html',
  styleUrls: ['./edit-user-details.component.css']
})
export class EditUserDetailsComponent implements OnInit {

  @Input() user: User;
  

  constructor() { }

  ngOnInit() {
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
        'Access-Control-Allow-Credentials': 'true'
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
