import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as firebase from 'firebase';

interface post{
    key:string,
    values:{
        created,
        post:string,
        uid:string
    }
}

@Injectable()

export class PostService  {
    returndata:post = <post>{};
    data;
    ref = firebase.database().ref("posts");
    constructor() {
    }


    create( data: any, successCallback?, errorCallback?){
        let key = this.ref.push().key
        this.returndata.key = key;
        this.returndata.values = data
        this.ref
        .child( key )
        .set( data , res =>{
            successCallback(this.returndata)
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
        .remove( () => successCallback())
        .catch( ( e )=> errorCallback( e ))
    }

    edit( post, data, successCallback:(data: any) => void, errorCallback ){
        this.ref
        .child( post.key )
        .update( data , ()=> successCallback( post ) ).catch( () =>{
            errorCallback();
        })
    }

}