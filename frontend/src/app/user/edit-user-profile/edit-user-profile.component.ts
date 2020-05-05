import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/user';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css']
})
export class EditUserProfileComponent implements OnInit {

  @Input() user: User;
  passwordMismatch: boolean = false;
  userUrl = "http://localhost:8080/api/user/";

  @Output() onUserSubmit = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.user.id);
    this.userUrl += this.user.id;
  }

  updateUser(firstName: string, lastName: string, email: string, password: string, verifyPassword: string) {

    if (password !== verifyPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.user.firstName = (firstName !== '') ? firstName : this.user.firstName;
    this.user.lastName = (lastName !== '') ? lastName : this.user.lastName;
    this.user.email = (email !== '') ? email : this.user.email;
    this.user.password = (password !== '') ? password : this.user.password;


    fetch(this.userUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
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
    this.onUserSubmit.emit(null);
  }


}


