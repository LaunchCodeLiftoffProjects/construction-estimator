import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user'
import { UserDetails } from '../user-details';
import { Project } from 'src/app/project';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  saveItem(firstName: string, lastName: string, email: string, password: string, userDetails: UserDetails, projects: Project[]) {
    let user = new User(firstName, lastName, email, password, null, []);
    console.log("saved user", user);
    // TODO: POST TO SERVER
    fetch('http://localhost:8080/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: JSON.stringify(user),
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log('Success:', data);
    }).catch(function(error) {
      console.error('Error:', error);
    });
  }

}
