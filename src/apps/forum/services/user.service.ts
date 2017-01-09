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


  /**
   *
   * @param data expects metadata from user like firstname, lastname, age etc.
   *
   */

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


  /**
   * in this method i've user the signOut() method provided by firebaseAuth
   * and then removeditem the uid i stored to localStorage when the user logged in.
   */
  logout(){
       this.firebseAuth.signOut();
       localStorage.removeItem('aonic_firebase_session')
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

  /**
   *
   * @param key {string} this is the key of the specific object from firebase database. this is required to get the requested data. just like idx.
   *
   *
   */

    get(key:string, successCallback, errorCallback){
        this.ref.child( key ).once( 'value', snapshot => {
            if ( snapshot.exists() ) successCallback( snapshot.val() );
            else successCallback( null );
        }, errorCallback );
    }


  /**
   *
   * @param data {object} update() method expects new data object
   * @description NOTE: this is used for updating user meta data. not creating user meta data.
   */
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
