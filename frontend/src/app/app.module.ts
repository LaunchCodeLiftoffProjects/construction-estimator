import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { HeaderComponent } from './header/header.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { RegisterComponent } from './register/register.component';
import { EditUserProfileComponent } from './user/edit-user-profile/edit-user-profile.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { EditUserDetailsComponent } from './user/edit-user-details/edit-user-details.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { HttpClientModule } from '@angular/common/http';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
// import { ProjectEstimateComponent } from './project-list/project-estimate/project-estimate.component';
import { MinValDirective } from './min-val.directive';



@NgModule({
  declarations: [
    AppComponent,
    CreateProjectComponent,
    HeaderComponent,
    ProjectDetailsComponent,
    ProjectListComponent,
    UserProfileComponent,
    RegisterComponent,
    EditUserProfileComponent,
    LoginComponent,
    AboutComponent,
    PageNotFoundComponent,
    EditUserDetailsComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    // ProjectEstimateComponent],
    BoardUserComponent,
    MinValDirective],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule, // brings over info from app-routing.module.ts
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
