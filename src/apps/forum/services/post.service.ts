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
        .child( localStorage.getItem('aonic_firebase_session') )
        .push( data , res =>{
            console.log('res ' + res);
        })
    }
    get(){
    }
    page(){
    }

}