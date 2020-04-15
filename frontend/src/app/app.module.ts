import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { HeaderComponent } from './header/header.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { EditProjectComponent } from './project/edit-project/edit-project.component';
import { RegisterUserComponent } from './user/register-user/register-user.component';
import { EditUserProfileComponent } from './user/edit-user-profile/edit-user-profile.component';
import { HowToComponent } from './project/how-to/how-to.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateProjectComponent,
    HeaderComponent,
    ProjectDetailsComponent,
    ProjectListComponent,
    UserProfileComponent,
    EditProjectComponent,
    RegisterUserComponent,
    EditUserProfileComponent,
    HowToComponent,
    LoginComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule // brings over info from app-routing.module.ts
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
