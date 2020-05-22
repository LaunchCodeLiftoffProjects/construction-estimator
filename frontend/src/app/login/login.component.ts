import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { EmailValidator } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, ParamMap, NavigationExtras, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  header: HeaderComponent;
  mySubscription: any;

  imagePaths: string[] = ["/assets/examples/bath_coastal.jpg", "/assets/examples/bath_grey.jpg",
            "/assets/examples/bath_tan.jpg", "/assets/examples/bedroom_chevron.jpg",
            "/assets/examples/bedroom_luxe.jpg", "/assets/examples/bedroom_teal_yellow.jpg",
            "/assets/examples/kitchen_green.jpg", "/assets/examples/kitchen_grey.jpg",
            "/assets/examples/kitchen_white.jpg", "/assets/examples/living_farmhouse.jpg",
            "/assets/examples/living_green.jpg", "/assets/examples/living_industrial", 
            "/assets/examples/living_white.jpg", "/assets/examples/living_cobalt"];
  selectedImage: string = this.getRandom(this.imagePaths);
  
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) {
   
   }

  ngOnInit() {
    
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.router.navigate(['/user/profile/']);
    }

  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  onSubmit() {

    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);
        console.log(data.token);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.reloadPage();

      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );

  }

  reloadPage() {
    window.location.reload();
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

  getRandom(array: string[]): string {
    let randomIndex: number = Math.floor(Math.random()*array.length);
    return array[randomIndex];
  }

}