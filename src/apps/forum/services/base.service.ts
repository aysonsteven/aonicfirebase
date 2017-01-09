import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as _ from 'lodash';


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
    private pagination_key: string = '';
    private pagination_last_page: boolean = false; 
    data: any = {};
    returndata:post = <post>{};



    gets( databaseRef, successCallback, failureCallback? ) {
        let ref = firebase.database().ref( databaseRef ).limitToFirst(5)
        ref.once( 'value', snapshot => {
            if ( snapshot.exists() ) successCallback( snapshot.val() );
            else successCallback( null );
        }, failureCallback );
    }


  page( databaseRef, successCallback, failureCallback ) {
    let num = ( this.data['numberOfPosts'] ? this.data['numberOfPosts'] : 5 ) + 1;
    let ref = firebase.database().ref( databaseRef )
    let order = ref.orderByKey();
    let q;
    if ( this.pagination_key ) {
      q = order.endAt( this.pagination_key ).limitToLast( num );
    }
    else {
      q = order.limitToLast(num);
    }

    q
      .once('value', snapshot => {
          let data = snapshot.val();
          let keys = Object.keys( data );
          let newData;
          if ( keys.length < this.data['numberOfPosts'] + 1 ) {
            newData = data;
            this.pagination_last_page = true;
          }
          else {
            this.pagination_key = Object.keys( data ).shift();
            newData = _.omit( data, this.pagination_key );
          }
          successCallback( newData );
        },
        failureCallback );
  }
  isLastPage() {
    return this.pagination_last_page;
  }
  resetPagination() {
    this.pagination_key = '';
  }
}