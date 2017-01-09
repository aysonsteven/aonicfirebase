import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BaseModule } from '../pages/base/base.module';
import { ForumRoutingModule } from '../app/forum-routes.module'

import * as firebase from 'firebase';



import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { Data } from '../services/data';
import { Base } from '../services/base.service';
import { PostTest } from '../services/unit-test/post-test';
import { Test } from '../services/unit-test/test';

import { LoginPage } from '../pages/authentication/login/login.component';
import { RegistrationPage } from '../pages/authentication/registration/registration.component';
import { ForumHomePage } from '../pages/forumpages/forumhome/forumhome';
import { PostComponent } from '../components/postform/postform';
import { PostViewComponent } from '../components/view-component/view-component';
import { EditFormComponent } from '../components/edit-component/form-component';
import { CommentComponent } from '../components/comment/comment.component';



firebase.initializeApp({
    apiKey: "AIzaSyA8WD1md2iuqKem3DvoPo_iHSJ25K4gFh0",
    authDomain: "aonicfirebase.firebaseapp.com",
    databaseURL: "https://aonicfirebase.firebaseio.com",
    storageBucket: "aonicfirebase.appspot.com",
    messagingSenderId: "313963141513"
  });

  
@NgModule({
  declarations: [
    LoginPage,
    RegistrationPage,
    ForumHomePage,
    PostComponent,
    PostViewComponent,
    EditFormComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BaseModule,
    FormsModule,
    ForumRoutingModule
  ],

  providers: [ UserService, PostService, Data, Base, Test, PostTest ],
})
export class ForumModule {}


