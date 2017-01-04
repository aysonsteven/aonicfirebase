import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BaseModule } from '../pages/base/base.module';
import { ForumRoutingModule } from '../app/forum-routes.module'

import { FileSelectDirective,
        FileDropDirective } from 'ng2-file-upload';


import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';

import { LoginPage } from '../pages/authentication/login/login.component';
import { RegistrationPage } from '../pages/authentication/registration/registration.component';
import { ForumHomePage } from '../pages/forumpages/forumhome/forumhome';
import { ForumMessagePage } from '../pages/forumpages/forummessage/forummessage';
import { PostComponent } from '../components/postform/postform';
import { MessageComponent } from '../components/messageform/messageform';
import { PostViewComponent } from '../components/view-component/view-component';
import { EditFormComponent } from '../components/edit-component/form-component';


@NgModule({
  declarations: [
    LoginPage,
    RegistrationPage,
    ForumHomePage,
    ForumMessagePage,
    PostComponent,
    MessageComponent,
    PostViewComponent,
    EditFormComponent,
    FileSelectDirective,
    FileDropDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BaseModule,
    FormsModule,
    ForumRoutingModule
  ],

  providers: [ UserService, PostService ],
})
export class ForumModule {}


