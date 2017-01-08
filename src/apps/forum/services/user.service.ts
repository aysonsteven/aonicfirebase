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
    data;
    ref = firebase.database().ref("users");
    
    public urlPhoto:string;
    firebseAuth: firebase.auth.Auth;


  constructor() {
    console.log('Hello UserService Provider');
    this.firebseAuth = firebase.auth();
  }

    /**
     * registration using email&password
     * @description behavior of register method : After registration the user will autratically logged in.
     * 
     * @param( email, password ) basic prorperties of Firebase Authentication
     * 
     * @code sample base usage of register method.
        register(){
            this.userService.register( email, password, response =>{

            }, errorCallback =>alert('Something went wront' + errorCallback) ) show alert or message on errorcallback
        }
     * @code
     */
    register( email, password, successCallback, failureCallback ) {
        this.firebseAuth.createUserWithEmailAndPassword(email, password)
            .catch( error => alert( 'error' + error) )
                .then( registered => {
                    localStorage.setItem('aonic_firebase_session' , registered.uid);
                    successCallback( registered );
                }, error => {
                    failureCallback(  'test');
                });
    }



    ///this method is used in registration it'll create user meta data at regisrtaion

    create_user_metadata( data: any, successCallback?, errorCallback?){
        this.ref
        .child( localStorage.getItem('aonic_firebase_session') )
        .set( data , res =>{
            console.log('res ' + res);
        })
    }






    /**
     * signin using email&password
     * 
     * @param( email, password ) basic prorperties of Firebase Authentication
     * 
     * @code sample base usage of register method.
        login(){
            this.userService.login( email, password, response =>{
            }, error =>alert('error ' + error ) )
        }
     * @code
     */
    login( email, password, successCallback:(login : any) => void, errorCallback:(error:any) => void ) {
        this.firebseAuth.signInWithEmailAndPassword(email, password)
                .then( login => {
                    if( login ) localStorage.setItem('aonic_firebase_session' , login.uid);
                    if( login )successCallback( login );
                }, error => {
                    if( error.message == 'The password is invalid or the user does not have a password.') {
                        error.message = 'incorrect password';
                    }
                    if( error.message == 'There is no user record corresponding to this identifier. The user may have been deleted.'){
                        error.message = 'User not found in the database';
                    } 
                    errorCallback(  error );  
                });
    }



    //signout using firebase authentication signout()method + removeitem from localstorage
    logout(){
       this.firebseAuth.signOut();
       localStorage.removeItem('aonic_firebase_session')   
    }


    /**
     * resetPassword
     * 
     * @param( email ) firebaseAuth will require the user's email to reset password
     * 
     * 
     * @description note: firebase will send password reset to the email of the user.
     */
    resetPassword(email: string): any {
        return this.firebseAuth.sendPasswordResetEmail(email);
    }





    /**
     * checklogin
     * localStorage instead of firebaseauth check login state
     * 
     * localStorage is much faster than firebaseauth checklogin
     */
    checklogin( successCallback:(user:any) => void, noCallback:() => void ){
    
            if ( localStorage.getItem('aonic_firebase_session' ) ) {
                successCallback(  localStorage.getItem('aonic_firebase_session' ) );
            } else {
                noCallback( );
            }
      
    }



    get(key:string, successCallback, errorCallback){
        this.ref.child( key ).once( 'value', snapshot => {
            if ( snapshot.exists() ) successCallback( snapshot.val() );
            else successCallback( null );
        }, errorCallback );
    }

    gets( successCallback, failureCallback? ) {
        this.ref.once( 'value', snapshot => {
            if ( snapshot.exists() ) successCallback( snapshot.val() );
            else successCallback( null );
        }, failureCallback );
    }

    update(data: any, successCallback:( data: any ) => void, errorCallback:( error ) => void){
        let key =  localStorage.getItem('aonic_firebase_session');
        console.log( "This user's key to update: " , key );
        this.ref.child( key )
            .update( data )
            .then ( re => {
                successCallback( re )
                alert( "Account successfully updated" );
                console.log("Data to be stored on cache  ", this.data)
        }, error=> errorCallback( error ));
    }

}
