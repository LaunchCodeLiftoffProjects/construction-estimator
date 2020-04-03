import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { ProjectListComponent } from './project/project-list/project-list.component';

const routes: Routes = [
  {path: 'create-project' , component: CreateProjectComponent},
  {path: 'project-details' , component: ProjectDetailsComponent},
  {path: 'project-list', component: ProjectListComponent}
  // , {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
