import { Component, NgZone } from '@angular/core';
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
    email:string,
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
    constructor( public userService: UserService, private router: Router, private data: Data, private ngZone: NgZone){
        this.checklogin()
    }
    
    

    onClickLogin(){
        if( this.validate () == false ) return;
        this.userService.login( this.loginForm.email, this.loginForm.password, response =>{
            console.log( 'response ' + JSON.stringify(response) )
            this.router.navigate(['/home']);
        }, error =>this.renderStatus( error ) )
    }

    renderStatus( error ){
        this.ngZone.run(() =>{
            this.formStatus.error = error;
        })
    }
    onClickReset(){
        this.formStatus = <status> {}
    }
    onFocusUserID(){
        this.onClickReset();
    }
    
    checklogin(){
        
        this.userService.checklogin( res=>{
            alert('res ' + JSON.stringify(res) )
            this.router.navigate(['/home']);
        }, ()=>console.log('nocallback'))
    }
    validate(){
        if( this.loginForm.email == null || this.loginForm.email == ''){
            this.formStatus.userID = 'Please enter your id';
            return false;
        }
        if( this.loginForm.password == null || this.loginForm.password == '' ){
            this.formStatus.userPassword = 'no password';
            return false;
        }
        return true;
    }
}