import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Base } from './base.service';
import * as firebase from 'firebase';




@Injectable()

export class PostService extends Base  {
    

 
    
    constructor() {
        super();
    }


    



    delete( databaseRef, key: string, successCallback, errorCallback){
        let ref = firebase.database().ref( databaseRef )
        .ref
        .child( key )
        .remove( () => successCallback())
        .catch( ( e )=> errorCallback( e ))
    }


    /**
     * create() POST to firebase database
     * @description behavior of create().
     * 
     * @param( databaseRef, data ) 
     * @param databaseRef this is the parent key of the post to firebase Database
     * @param data this holds the data that will be posted to firebase Database
     * 
     * @code sample base usage of write method.
     *  
     *  post(){
     *   this.postservice.write( 'posts',  data, res => {
     *      this.posts.push( res );       
     *  }, error => alert( error ) ) 
     * } 
     *          
     *   
     * @code
     */

    write( databaseRef, data: any, successCallback?, errorCallback? ){
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


    /**
     * createcomment() POST to firebase database
     * @description behavior of comment(). write and createcomment is almost the same 
     * the only difference is that the create comment accepts a parameter postkey
     * 
     * @param( postkey, databaseRef, data ) 
     * @param databaseRef this is the parent key of the post to firebase Database
     * @param data this holds the data that will be posted to firebase Database
     * @param postkey is the parent key or the post key where the comment will be listed.
     * 
     *          
     *   
     * @code
     */

    createcomment( postkey, databaseRef, data: any, successCallback? ,  errorCallback? ){
        let ref = firebase.database().ref( databaseRef )
        let key = ref.push().key
        this.returndata.key = key;
        this.returndata.values = data
        ref
        .child( postkey )
        .child( key )
        .set ( data, res =>{
            successCallback( this.returndata )
        })
    }
    /************
     * edit() edit a post/comment to firebase database
     * @description behavior of comment(). write and createcomment is almost the same 
     * the only difference is that the create comment accepts a parameter postkey
     * 
     * 
     * @param key {string} this is the comment/post that is to be editted
     * 
     *          
     *   
     * @code
     */
    edit(databaseRef, key, data, successCallback:(data: any) => void, errorCallback ){
        let ref = firebase.database().ref( databaseRef )
        ref
        .child( key )
        .update( data , ()=> successCallback( key ) )
        .catch( error =>{
            errorCallback( error )
        })
        
    }



  getCurrentDate(){
    let date = new Date()
    let dd = date.getDate();  
    
    let mm = date.getMonth()+1;   
    let yyyy = date.getFullYear();  
    if(dd<10)   
    {  
        dd= 0 +dd;  
    }   
    
    if(mm<10)   
    {  
        mm=0+mm;  
    }   
    let currentdate = mm+'/'+dd+'/'+yyyy;  
    console.log(currentdate); 
    return currentdate;

  }

}