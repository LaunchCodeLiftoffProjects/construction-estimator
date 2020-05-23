import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { HeaderComponent } from './header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  
  
  constructor(private router: Router, private tokenStorageService: TokenStorageService) {
   
   }

  ngOnInit() {
   
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }



}