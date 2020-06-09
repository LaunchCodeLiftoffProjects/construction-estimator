import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user'
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

// jQuery needed to autoplay carousel when using Angular routing
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
  user: User = new User("", "", "", "", null, []); // for ngModel binding
  verify: string;
  form: any = {};

  imagePaths: string[] = ["bath_tan.jpg", "bedroom_chevron.jpg",
                          "bedroom_luxe.jpg", "kitchen_grey.jpg",
                          "kitchen_white.jpg", "living_industrial.jpg"];

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

  checkVerify() {
    if (this.verify === this.user.password) {
      this.passwordMismatch = false;
    } else {
      this.passwordMismatch = true;
    }
  }

  //FIGURE OUT IF YOU'RE GOING TO REPLACE THIS WITH A CALL TO AUTHSERVICE AND A RESPONSE PARSE
  saveUser() {

    // don't submit form if passwords mismatch
    if(this.user.password !== this.verify) {
      this.passwordMismatch = true;
      console.log("password mismatch")
      return;
    }

    // values are already saved in user object due to ngModel binding
    console.log("saved user", this.user);

    this.authService.register(this.user).subscribe(
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
