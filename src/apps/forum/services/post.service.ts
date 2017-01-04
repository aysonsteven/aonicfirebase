import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Server } from '../services/server';

interface POST_DATA{
    id:string,
    session_id:string,

}
interface MEMBER_LOGIN_DATA {
    id?: string;
    stamp?: string;
    userid: string;         
    password?: string;     
    session_id?: string;   
};

export interface PAGE_OPTION extends PAGE_DATA {}
export interface PAGE_DATA {
    post_id: string;
    page_no?: number;
    fields?: string;
    limit?: number;
    expire?: number;
};
const XBASE_SESSION_ID = 'xbase-session-id';
@Injectable()

export class PostService extends Server {

    constructor( http: Http ) {
        super( http );
    }


    logged( yesCallback: ( session_id: string ) => void, noCallback?: () => void ) {
        let session_id = localStorage.getItem( XBASE_SESSION_ID );
        if ( session_id ) yesCallback( session_id );
        else noCallback? noCallback() : console.log("no callback is undefined");
    }



    hasError( data: POST_DATA ) : boolean | string {

        if ( data.id === void 0 ) return 'user-id-is-empty-login-first';
        if ( data.session_id === void 0 ) return 'session_id-is-empty';

        return false;
    }
    getError( data: POST_DATA ) : string {
        return <string> this.hasError( data );
    }

    create( data, successCallback: ( re ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        data['mc'] = 'post.write';
        let login = this.getLoginData();
     console.log('id 1 ' + login )
        if ( login ) {
            data.id = login.id;
            data.session_id = login.session_id;
            console.log('data ' + login)
        }
        console.log('login ' + JSON.stringify(login) )
        // if ( this.hasError( data ) ) return errorCallback( this.getError( data ) );
        console.log('data s' + data)
        this.post( data,
            successCallback,
            errorCallback );
    }


    update( data: POST_DATA, successCallback: ( re ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        data['action'] = 'post_edit_submit';
        let login = this.getLoginData();
        if ( ! login ) return errorCallback('login first');
        data.id = login.id;
        data.session_id = login.session_id;
        // if ( this.hasError( data ) ) return errorCallback( this.getError( data ) );
        this.post( data,
            successCallback,
            errorCallback );
    }

 
    load( idx, successCallback: ( re ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let i = parseInt( idx );
        if ( ! i ) alert("wrong idx_post. it is not a number");
        let url = this.getUrl( 'post_get_submit&idx=' + i );
        super.get( url,
            successCallback,
            errorCallback,
            completeCallback );
    }


    query( data : any, successCallback : any, errorCallback  : any ) {
        let body = this.buildQuery( data );
        console.log("debug url: ", this.server  + '?' + body );
        this.http.post( this.server, body, this.requestOptions )
            .subscribe( data => {
                try {
                    let re = JSON.parse( data['_body'] );
                    if ( re['code'] ) return errorCallback( re['message'] );
                    //console.log('query::sucess: ', data);
                    successCallback( data['_body'] );
                }
                catch( e ) {
                    //console.log(data);
                    errorCallback(data['_body']);
                }
            });
    }

    delete( idx, successCallback: ( re: any ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        let data = {};
        data['idx'] = idx;
        data['mc'] = 'post.delete';
        
        let login = this.getLoginData();
        if ( login ) {
            data['id'] = login.id;
            data['session_id'] = login.session_id;
            console.log('session '  + data['session_id'])
        }
        
        this.query( data,
            successCallback,
            errorCallback);
    }



    page( data: PAGE_OPTION, successCallback: ( page ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        data.page_no = data.page_no ? data.page_no : 1;
        data.limit = data.limit ? data.limit : 30;
        data.fields = data.fields ? data.fields : '';

        if ( data.expire !== void 0 ) return this.pageCache( data, successCallback, errorCallback, completeCallback );

        let url = this.getUrl() + 'post-list&post_id=' + data.post_id + '&page_no=' + data.page_no + '&limit=' + data.limit + '&fields=' + data.fields;
        if ( this.debug ) console.log("page() url: ", url);
        if ( data.page_no == 1 ) {
            // console.log("page no: 1");
            this.cacheCallback( data.post_id, successCallback );
        }

        this.get( url, (page) => {
            if ( data.page_no == 1 ) this.saveCache( data.post_id, page );
            successCallback( page );
        }, errorCallback, completeCallback );
    }

    pageCache( option: PAGE_OPTION, successCallback: ( page ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
        // console.log("pageCache() : ", option);
        let cache_id = 'cache-' + option.post_id + '-' + option.page_no;
        let page = this.getCache( cache_id, option.expire );
        if ( page ) {
            // console.info("use cached data");
            successCallback(  page );
            completeCallback();
            return;
        }
        /**
         * If this code runs, successCallback() may be called again but only once every expire.
         */
        if ( this.isCacheExpired( cache_id, option.expire ) ) {
            // console.info("Cache expired. Going to cache");
            let url = this.getUrl() + 'post-list&post_id=' + option.post_id + '&page_no=' + option.page_no + '&limit=' + option.limit + '&fields=' +option.fields;
            this.get( url, (page) => {
                console.info("Got new page. Set cache");
                successCallback( page );
                this.setCache( cache_id, page );
            }, errorCallback, completeCallback );
        }
    }



    getForums( successCallback: (data: any) => void, errorCallback?: (error: string) => void, completeCallback?: () => void ) {
        // console.log('getForums()');
        // check if it has cached data.
        let url = this.getUrl('forums');
        // console.log('url:', url);
        this.get( url, successCallback, errorCallback, completeCallback );

        /*
        this.http.get( url )
            .subscribe( re => {
                this.responseData( re, successCallback, errorCallback );
            });
            */
    }


    getPermalink( post ) {
        let full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        full += '/article/' + post.idx;
        return full;
    }

    getLink( post ) {
        let full = '/article/' + post.idx;
        return full;
    }

}