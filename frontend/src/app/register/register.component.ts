import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user'
import { UserDetails } from '../user-details';
import { Project } from 'src/app/project';
import { Router, RouterModule, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  id: number;
  passwordMismatch: boolean = false;

 constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  saveUser(firstName: string, lastName: string, email: string, password: string, verifyPassword: string) {

    // don't submit form if passwords mismatch
    if(password !== verifyPassword) {
      this.passwordMismatch = true;
      console.log("password mismatch")
      return;
    }

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
      response.json().then(function(json) {
        this.id = Number(json.id);

        console.log(this.id);

        this.router.navigate(['/user/profile/', this.id]);
      }.bind(this));
    }.bind(this)).then(function(data) {
      console.log('Success:', data);
    }).catch(function(error) {
      console.error('Error:', error);
    });
  }

}
