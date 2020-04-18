import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { EditUserProfileComponent } from './user/edit-user-profile/edit-user-profile.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { EditProjectComponent } from './project/edit-project/edit-project.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path: 'login' , component: LoginComponent},
  {path: 'register' , component: RegisterComponent},
  {path: 'about' , component: AboutComponent},
  {path: 'user/profile' , component: UserProfileComponent},
  {path: 'user/profile/edit' , component: EditUserProfileComponent},
  {path: 'project/create' , component: CreateProjectComponent},
  {path: 'project/add-details' , component: ProjectDetailsComponent},
  {path: 'project/list', component: ProjectListComponent},
  {path: 'project/edit' , component: EditProjectComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
