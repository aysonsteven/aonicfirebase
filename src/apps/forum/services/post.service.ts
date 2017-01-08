import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Base } from './base.service';
import * as firebase from 'firebase';




@Injectable()

export class PostService extends Base  {

  private pagination_key: string = '';      // pagination key
  private pagination_last_page: boolean = false; // become true when last page has extracted.
    
    constructor() {
        super();
    }




    get(){
    }
    page(){
    }

    



    delete( databaseRef, key: string, successCallback, errorCallback){
        let ref = firebase.database().ref( databaseRef )
        .ref
        .child( key )
        .remove( () => successCallback())
        .catch( ( e )=> errorCallback( e ))
    }


    create(databaseRef, data: any, successCallback?, errorCallback?){
        let ref = firebase.database().ref( databaseRef )
        let key = ref.push().key
        this.returndata.key = key;
        this.returndata.values = data
        ref
        .child( key )
        .set( data , res =>{
            successCallback(this.returndata)
        })
    }

    edit(databaseRef, post, data, successCallback:(data: any) => void, errorCallback ){
        let ref = firebase.database().ref( databaseRef )
        ref
        .child( post.key )
        .update( data , ()=> successCallback( post ) )
        .catch( error =>{
            errorCallback( error )
        })
        
    }

}