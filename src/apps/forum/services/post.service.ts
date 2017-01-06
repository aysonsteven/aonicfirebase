import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as firebase from 'firebase';



@Injectable()

export class PostService  {
    data;
    ref = firebase.database().ref("posts");
    constructor() {
    }


    create( data: any, successCallback?, errorCallback?){
        this.ref
        // .child( localStorage.getItem('aonic_firebase_session') )
        .push( data , res =>{
            console.log('data : ' + data )
            successCallback(data)
        })
    }
    get(){
    }
    page(){
    }

    gets( successCallback, failureCallback? ) {
        this.ref.once( 'value', snapshot => {
            if ( snapshot.exists() ) successCallback( snapshot.val() );
            else successCallback( null );
        }, failureCallback );
    }

    delete( key: string, successCallback, errorCallback){
        this.ref
        .child( key )
        .remove()
        .catch( ( e )=> errorCallback( e ))
    }

}