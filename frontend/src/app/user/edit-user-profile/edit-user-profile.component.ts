import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/user';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css']
})
export class EditUserProfileComponent implements OnInit {

  @Input() user: User;
  passwordMismatch: boolean = false;
  userUrl = "http://localhost:8080/api/user/";
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  private roles: string[];
  id: number;
  isLoginFailed: boolean;
  errorMessage: string;
  verify: string;
  form: any = {};
  changedPassword: boolean = false;
  
  

  @Output() onUserSubmit = new EventEmitter();

  constructor(private authService: AuthService, private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    console.log("token", this.tokenStorageService.getToken());
    console.log("logged in", this.isLoggedIn);

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
    
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.email;
      this.id = user.id;
      this.verify = this.user.password;
      console.log("id", this.id);

    } else {
      this.router.navigate(['/login']);
    }
    console.log(this.user.id);
    this.userUrl += this.user.id;
  }

  updateUser() {
    
      if (this.user.password !== this.verify) {
        this.passwordMismatch = true;
        return;
      }
    


    fetch(this.userUrl, {
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


  this.authService.login(this.user).subscribe(
    data => {
      this.tokenStorageService.saveToken(data.token);
      this.tokenStorageService.saveUser(data);
      console.log(data.token);
      this.isLoginFailed = false;
      this.isLoggedIn = true;

    },
    err => {
      this.errorMessage = err.error.message;
      this.isLoginFailed = true;
    }
  );

  }


  closeEdit() {
    console.log("closing edit");
    this.onUserSubmit.emit(null);
  }

  checkVerify() {
    if (this.verify == '') {
      this.passwordMismatch = false;
    }
  }


}


