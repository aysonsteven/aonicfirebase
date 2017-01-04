import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';

interface session{
    session_id
}
interface MEMBER_LOGIN_DATA {
    id: string;    
    session_id: string;   
};
const XBASE_SESSION_ID = 'xbase-session-id';
export const MEMBER_LOGIN = 'philgo-login';
/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService  {

  session_id = 'xbase-session-id';

  url:string = 'http://work.org/forum-backend/index.php'

  constructor(public http: Http) {
    console.log('Hello UserService Provider');
  }

  get requestOptions() : RequestOptions {
          let headers  = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
          let options  = new RequestOptions({ headers: headers });   
          return options;
  }


  getLoginData() : MEMBER_LOGIN_DATA {
    let data = localStorage.getItem( MEMBER_LOGIN );
    if ( ! data ) return null;
    try {
      let login = JSON.parse( data );
      return login;
    }
    catch ( e ) {
      return null;
    }
  }

  buildQuery( params : any ) {
      return this.http_build_query( params );

  }



  login( data : any, successCallback: (session_id) => void, errorCallback: (error:string) => void ) {
      data['mc'] = 'user.login';
      this.query( data, (session_id : any )=> {
          localStorage.setItem( XBASE_SESSION_ID , JSON.stringify(session_id) );
          successCallback( 'logged in( session_id ): '+ JSON.stringify(session_id) );
          console.log('test session ' + JSON.stringify(session_id))
      }, errorCallback );
  }
    setLoginData( data ) : void {
        let login = { id: data.id, session_id: data.session_id };
        let str = JSON.stringify( data );
        localStorage.setItem( MEMBER_LOGIN, str );
    }


  logged( yesCallback: ( session_id: string ) => void, noCallback?: () => void ) {
      
    let session_id = localStorage.getItem( XBASE_SESSION_ID );
    if ( session_id ) yesCallback( session_id );
    else noCallback? noCallback() : console.log("no callback is undefined");
  }
  logout( successCallback: (session_id:string ) =>void,  noCallback?: () => void ){
    if( localStorage.getItem( XBASE_SESSION_ID ) ){
      localStorage.removeItem( XBASE_SESSION_ID );
      successCallback('logged out successfully');
    }else noCallback();
  }
  edit( data: any, successCallback:any, errorCallback : any){
        data['mc'] = 'user.update';
        // if ( this.hasError( data ) ) return errorCallback( this.getError( data ) );
        this.post( data,
            successCallback,
            errorCallback );
  }


  post( data : any, successCallback , errorCallback: (error:string) => void ){
    this.query( data, successCallback=>{
      console.log( successCallback )
    },errorCallback=>{
      console.log( errorCallback )
    })
  }

  query( data : any, successCallback : any, errorCallback  : any ) {
    let body = this.buildQuery( data );
    console.log("debug url: ", this.url  + '?' + body );
    this.http.post( this.url, body, this.requestOptions )
      .subscribe( data => {
          try {
              let re = JSON.parse( data['_body'] );
              if ( re['code'] ) return errorCallback( re['message'] );
              //console.log('query::sucess: ', data);
              successCallback( re['data'] );
          }
          catch( e ) {
              //console.log(data);
              errorCallback(data['_body']);
          }
      });
  }



  http_build_query (formdata : any, numericPrefix='', argSeparator='') { 
    var urlencode = this.urlencode;
    var value : any
    var key : any
    var tmp : any = []
    var _httpBuildQueryHelper = function (key : any, val : any, argSeparator : any) {
        var k : any
        var tmp : any = []
        if (val === true) {
        val = '1'
        } else if (val === false) {
        val = '0'
        }
        if (val !== null) {
        if (typeof val === 'object') {
            for (k in val) {
            if (val[k] !== null) {
                tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
            }
            }
            return tmp.join(argSeparator)
        } else if (typeof val !== 'function') {
            return urlencode(key) + '=' + urlencode(val)
        } else {
            throw new Error('There was an error processing for http_build_query().')
        }
        } else {
        return ''
        }
    }

    if (!argSeparator) {
        argSeparator = '&'
    }
    for (key in formdata) {
        value = formdata[key]
        if (numericPrefix && !isNaN(key)) {
        key = String(numericPrefix) + key
        }
        var query = _httpBuildQueryHelper(key, value, argSeparator)
        if (query !== '') {
        tmp.push(query)
        }
    }

          return tmp.join(argSeparator)
      }

    user_register( data : any, successCallback: (session_id:string) => void, errorCallback: (error:string) => void ) {
        data['mc'] = 'user.register';
        this.query( data, (session_id : any)  => {
            localStorage.setItem( XBASE_SESSION_ID, JSON.stringify(session_id) );
          console.log('session Id',  localStorage.getItem( XBASE_SESSION_ID ));
            successCallback( JSON.stringify(session_id) );
        }, errorCallback );
    }

  urlencode (str : any) {
    str = (str + '')
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/%20/g, '+')
  }

}
