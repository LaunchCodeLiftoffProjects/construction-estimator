import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user'
import { UserDetails } from '../user-details';
import { Project } from 'src/app/project';
import { EmailValidator } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  emailSaved: string;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isLoggedIn = false;
  isLoginFailed = false;

  id: number;
  passwordMismatch: boolean = false;

 constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit() {

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.tokenStorage.signOut();
      window.location.reload();
    }

    if (this.isLoggedIn) {
      this.router.navigate(['/user/profile/']);
    }
  }


  //FIGURE OUT IF YOU'RE GOING TO REPLACE THIS WITH A CALL TO AUTHSERVICE AND A RESPONSE PARSE
  saveUser(firstName: string, lastName: string, email: string, password: string, verifyPassword: string) {

    // don't submit form if passwords mismatch
    if(password !== verifyPassword) {
      this.passwordMismatch = true;
      console.log("password mismatch")
      return;
    }

    let user = new User(firstName, lastName, email, password, null, []);
    console.log("saved user", user);


    this.authService.register(user).subscribe(
      data => {
        console.log(data);
        
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        //this is where you have to grab the type + token response and send it to token storage
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);
        console.log(data.token);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate(['/user/profile/']);
      
       
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
    
    // OLD FETCH POST TO SERVER
    // fetch('http://localhost:8080/api/user', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Credentials': 'true'
    //   },
    //   body: JSON.stringify(user),
    // }).then(function(response) {
    //   response.json().then(function(json) {
    //     this.id = Number(json.id);

    //     console.log(this.id);

    //     this.router.navigate(['/user/profile/', this.id]);
    //   }.bind(this));
    // }.bind(this)).then(function(data) {
    //   console.log('Success:', data);
    // }).catch(function(error) {
    //   console.error('Error:', error);
    // });


  }



}
