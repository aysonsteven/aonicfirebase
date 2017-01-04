import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService  {
  firebseAuth: firebase.auth.Auth;

  url:string = 'http://work.org/forum-backend/index.php'

  constructor() {
    console.log('Hello UserService Provider');
    this.firebseAuth = firebase.auth();
  }

    /**
     * registration using email&password
     * @After the user registered he/she will autmatically logged in.
     * 
     * 
     * @code sample base usage of register method.
     * 
    register(){
        this.userService.register( email, password, response =>{

        }, errorCallback =>alert('Something went wront' + errorCallback) ) show alert or message on errorcallback
    }
    
     * @endcode
     */
    register( email, password, successCallback, failureCallback ) {
        this.firebseAuth.createUserWithEmailAndPassword(email, password)
            .then( registered => {
                successCallback( registered );
            }, error => {
                failureCallback(  error.message);
            });
    }

////login
    login( email, password, successCallback, failureCallback ) {
        this.firebseAuth.signInWithEmailAndPassword(email, password)
            .then( login => {
                successCallback( login );
            }, error => {
                failureCallback(  error.message );
            });
    }

    logout(){
       this.firebseAuth.signOut();   
    }

    resetPassword(email: string): any {
        return this.firebseAuth.sendPasswordResetEmail(email);
    }


}
