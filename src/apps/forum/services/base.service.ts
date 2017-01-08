import { Injectable } from '@angular/core';
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

export class Base {
    returndata:post = <post>{};



    gets( databaseRef, successCallback, failureCallback? ) {
        let ref = firebase.database().ref( databaseRef ).limitToFirst(5)
        ref.once( 'value', snapshot => {
            if ( snapshot.exists() ) successCallback( snapshot.val() );
            else successCallback( null );
        }, failureCallback );
    }
}