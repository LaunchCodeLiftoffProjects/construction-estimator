import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateProjectComponent } from './project/create-project/create-project.component';
import { HeaderComponent } from './header/header.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    CreateProjectComponent,
    HeaderComponent,
    ProjectDetailsComponent,
    HttpClientModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule // brings over info from app-routing.module.ts
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
