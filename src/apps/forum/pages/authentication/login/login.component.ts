import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Data } from '../../../services/data';
import { Router } from '@angular/router';

export interface FileUploadResponse {
  success: boolean;
  item: any;
  response: any;
  status: any;
  headers: any;
}


interface form{
    id:string,
    password:string
}
interface status{
    error:string,
    userID:string,
    userPassword:string
}
@Component( {
    selector: 'login-page',
    templateUrl: 'login.component.html'
})
export class LoginPage {
    file_progress
    formStatus:status = <status>{}
    logindata
    loginForm: form = <form>{}
    constructor( public userService: UserService, private router: Router, private data: Data){
        this.checklogin()
    }
    
    onChangeTest($event){
  
        let file = $event.target.files[0];
        console.log("Console:file: ",file);
        if( file == void 0) return;
        this.file_progress = true;

        let ref = 'photo/' + Date.now() + '/' + file.name;
        console.log( 'file ' ,  file  )


        this.data.upload( { file: file, ref: ref }, uploaded=>{  
            this.onFileUploaded( uploaded.url, uploaded.ref );   
        }, error=>{
            alert('Error'+ error);
        },
        percent=>{    
            // this.renderPage();    
            // this.position = percent;     
        } );
    }


    onFileUploaded( url, ref){
        // this.form.varchar_1 = this.urlPhoto;
       
     //   this.old_photo_ref.push(this.urlPhoto);
      //  this.new_photo_ref.push(ref);
        
        this.file_progress = false;
        // this.urlPhoto = url;
        // this.photo.photoURL = url;

        
        // this.photo.photoREF = ref;
        // this.photoUploaded = true;
        // this.renderPage();
    }

    onClickLogin(){

    }

    onClickReset(){
    }
    onFocusUserID(){

    }
    
    checklogin(){

    }
    validate(){
        if( this.loginForm.id == null || this.loginForm.id == ''){
            this.formStatus.userID = 'Please enter your id';
            return false;
        }
    }
}