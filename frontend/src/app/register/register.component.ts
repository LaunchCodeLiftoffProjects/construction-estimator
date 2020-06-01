import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user'
import { UserDetails } from '../user-details';
import { Project } from 'src/app/project';
import { EmailValidator } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

// jsQuery needed to autoplay carousel when using Angular routing
declare var $: any;

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
  roles: string[] = [];

  id: number;
  passwordMismatch: boolean = false;

  imagePaths: string[] = ["/assets/examples/bath_tan.jpg", "/assets/examples/bedroom_chevron.jpg",
                          "/assets/examples/bedroom_luxe.jpg", "/assets/examples/kitchen_grey.jpg",
                          "/assets/examples/kitchen_white.jpg", "/assets/examples/living_industrial.jpg"];

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit() {

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.router.navigate(['/user/profile']);
    } 

    this.shuffle(this.imagePaths);

    // force autoplay carousel with Angular routing
    $(document).ready(function() {
      $('.carousel').carousel();
    })

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

        this.tokenStorage.saveUser(data);
        window.location.reload();
        this.router.navigate(['/user/profile/']);
        
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );

  }

  shuffle(array: string[]): string[] {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) { 
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

}
