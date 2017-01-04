import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

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
    formStatus:status = <status>{}
    logindata
    private result: FileUploadResponse
    loginForm: form = <form>{}
    constructor( public userService: UserService, private router: Router){
        this.checklogin()
    }
    
    
    onClickLogin(){
        if( this.validate () == false ) return;
        this.userService.login( this.loginForm, res =>{
            console.log('response ' + res );
            this.router.navigate(['/home']);
        }, err => console.error( 'error : ' + err ) )
    }

    onClickReset(){
    }
    onFocusUserID(){

    }
    
    checklogin(){
        this.userService.logged( res => this.logindata = res )
        if( this.logindata ){
            alert("oops you're already logged in")
            this.router.navigate(['/home'])
            console.log('logindata ' + this.logindata)
        }
    }
    validate(){
        if( this.loginForm.id == null || this.loginForm.id == ''){
            this.formStatus.userID = 'Please enter your id';
            return false;
        }
    }
}