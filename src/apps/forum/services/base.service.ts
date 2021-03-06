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

  /**
   * @description this method will get a list of post with limit.
   * @param databaseRef {string} firebase database reference
   *
   */

    gets( databaseRef, successCallback, failureCallback? ) {
        let ref = firebase.database().ref( databaseRef )
        let order = ref.orderByKey();
        let q;

        ref.once( 'value', snapshot => {
            if ( snapshot.exists() ) successCallback( snapshot.val() );
            else successCallback( null );
        }, failureCallback );
    }

  /**
   *
   * @description this method is for getting postlists batch by batch or by page,
   *    this also have a limit like gets() but this is used for getting next set of list.
   * @param databaseRef {string} firebase database  refenence
   *
   */
  page( databaseRef, successCallback, failureCallback ) {
    let num = ( this.data['numberOfPosts'] ? this.data['numberOfPosts'] : 5 ) + 1;
    let ref = firebase.database().ref( databaseRef )
    let order = ref.orderByKey();
    let q;
    let newData;
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
          
          if ( keys.length < this.data['numberOfPosts'] + 1 ) {
            newData = data;
            this.pagination_last_page = true;
            
          }
          else {
            this.pagination_key = Object.keys( data ).shift();
            newData = _.omit( data, this.pagination_key );
          }
          successCallback( newData );
        }, failureCallback);
  }


  isLastPage() {
    return this.pagination_last_page;
  }


  resetPagination() {
    this.pagination_key = '';
  }
}
