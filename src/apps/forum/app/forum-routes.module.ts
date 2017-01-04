import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { RegistrationPage } from '../pages/authentication/registration/registration.component';
import { LoginPage } from '../pages/authentication/login/login.component';
import { ForumHomePage } from '../pages/forumpages/forumhome/forumhome';

const appRoutes: Routes = [

  { path: '', component: LoginPage },
  { path: 'register', component: RegistrationPage },
  { path: 'login', component: LoginPage },
  { path: 'home', component: ForumHomePage},

];

@NgModule({

  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forChild( appRoutes )
    
  ],
  providers: [ ]
})
export class ForumRoutingModule {}


