import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';

export const MEMBER_LOGIN = 'philgo-login';
export class Server {
  self: Server = null;
  http: Http;
  debug: boolean = false;
    server = "http://work.org/forum-backend/index.php";
  constructor( http ) {
    this.http = http;
  }

  getLogin( callback: ( login ) => void ) : void {
    setTimeout( () => {
      let login = this.getLoginData();
      if ( login ) callback( login  );
    }, 1 );
  }
  getLoginData()  {
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

  get serverUrl() : string {
    return this.server;
  }


  /**
   * This does the same as 'http.get()' but in callback.
   *
   */
  get( url, successCallback: (data:any) => void, errorCallback?: ( e:any ) => void, completeCallback?: () => void ) {
    this._get( url, successCallback, errorCallback, completeCallback );
  }
  _get( url, successCallback: (data:any) => void, errorCallback?: ( e:any ) => void, completeCallback?: () => void ) {
    if ( this.debug ) console.info("get: ", url);
    this.http.get( url )
      .timeout( 25000, new Error('timeout exceeded') )
      .subscribe(
        re => this.responseData( re, successCallback, errorCallback ),
        er => this.responseConnectionError( er, errorCallback ),
        completeCallback );
  }



  /**
   *
   * @example code @see member.login()
   *
   */
  post( data : any, successCallback , errorCallback: (error:string) => void ){
    this.query( data, successCallback=>{
      console.log( successCallback )
    },errorCallback=>{
      console.log( errorCallback )
    })
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
              successCallback( re['data'] );
          }
          catch( e ) {
              //console.log(data);
              errorCallback(data['_body']);
          }
      });
  }
  /**
   *
   * Returns JSON parsed Object.
   *
   * @note this.get() 과 this.post() 호출 결과로 서버로 부터 받은 데이터를 파싱하고,
   *      code 에 0 의 값이 아니면, 에러이므로 errorCallback() 을 직접 호출 한다.
   *          즉, 서버 리턴 데이터가 에러인 경우에는 여기서 처리하므로 상위 메소드에서 처리 할 필요가 없다.
   *      또한 code 에 0 의 값이면 에러가 아니므로, successCallback() 을 호출한다.
   *          따라서 상위 메소드에서는 거의 할 일이 없지만, 별도의 처리가 필요하면,
   *          아래의 예제 처럼 직접 캡쳐해서 처리를 할 수 있다.
   * @attention all http request must use this method to parse.
   *
   * @param re - is the response of http.get() or http.post()
   * @param successCallback - is the success callback to be called when success.
   * @param errorCallback - is the error callback to be called when there is error.
   * @attention you can capture the callbacks and extra works.
   *
   * @use to get response data on subscribe()
   *          http.get.subscribe() 의 서버 리턴 값에서 JSON 파싱해서 값을 받기 위해서 사용. 단순히 JSON.parse( re['_body'] ) 와 같이 할 수 있으나 통일된 구문을 사용한다.
   * @code
   this.http.get( url )
   .subscribe( re => {
                    console.log('post::page() re: ', re);
                    this.responseData( re, (posts: POSTS) => {
                        if ( data.page_no == 1 ) this.saveCache( data.post_id, posts );
                        successCallback( posts );
                    }, errorCallback );
                });
   * @endcode
   *
   *
   * @code json-parse-error would probably be server error!
   e => {
                if ( e == 'json-parse-error' ) {
                this.process['error'] = 'Server Error. Please notify this to admin';
                }
                else this.process = { 'error': e };
            })
   * @endcode
   */
  responseData( re, successCallback: ( data: any ) => void, errorCallback: ( error: string ) => void ) : any {
    // console.log('Api::responseData() re: ', re);
    let data;
    try {
      data = JSON.parse( re['_body'] );
    }
    catch( e ) {
      console.error(e);
      console.info(re);
      if ( errorCallback ) return errorCallback('json-parse-error');
    }
    if ( this.isRequestError(data) ) {
      if ( errorCallback ) return errorCallback( data.message )
    }
    else successCallback( data );
  }

  responseConnectionError( error: Response | any, errorCallback: ( error : string ) => void ) {
    console.error(Response);
    if ( errorCallback ) errorCallback("No Internet! Please connect to internet.");
  }

  get requestOptions() : RequestOptions {
    let headers  = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options  = new RequestOptions({ headers: headers });
    return options;
  }


  getUrl( qs: string = '' ) {
    return this.serverUrl + "?module=ajax&submit=1&action=" + qs;
  }

  buildQuery( params ) {
    params[ 'module' ] = 'ajax'; // 'module' must be ajax.
    params[ 'submit' ] = 1; // all submit must send 'submit'=1
    return this.http_build_query( params );



  }







  search( data, successCallback: ( re: any ) => void, errorCallback: ( error: string ) => void, completeCallback?: () => void ) {
    let url = this.getUrl( 'search&' + this.http_build_query( data ) );
    this._get( url,
      successCallback,
      errorCallback,
      completeCallback );
  }



  isRequestError( data ) : boolean {
    if ( data['code'] && parseInt( data['code'] ) != 0 ) return true;
    else return false;
  }

  /**
   *
   * 
   *
   * 
   * @attenion the cached data must be in JSON string format.
   *
   * @param expire - if set true, it will delete the cached data if the cache interval is expired.
   * @code example
   if ( data.page_no == 1 ) this.cacheCallback( data.post_id, successCallback );
   * @endcode
   *
   */
  cacheCallback( cache_id, callback ) {
    let re = localStorage.getItem( cache_id );
    if ( re ) {
      let data = null;
      try {
        data = JSON.parse( re );
      }
      catch (e) {
        // error. no callback.
        console.error( "error on parsing data of localstroage.");
      }
      try {
        if ( data ) {
          // console.log("Api::cacheCallback()");
          callback( data );
        }
      }
      catch ( e ) {
        console.error("error on cacheCallback() ==> callback()");
      }
    }
    else {
      // no data. no callback.
    }
  }
  /**
   * 
   * Saves data into 'localStorage'.
   * It also saves timestamp to mark when the data was saved. 
   * 
   * @param id - can be any string.
   * @param data - Javascript raw value. NOT JSON string.
   * 
   * @attention the data must not be JSON format string because it does by itself.
   *
   * @code example
     this.responseData( re, (posts: POSTS) => {
        if ( data.page_no == 1 ) this.saveCache( data.post_id, posts );
        successCallback( posts );
    }, errorCallback );
   * @endcode
   */
  saveCache( cache_id:string, data:any ) {
    localStorage.setItem( cache_id, JSON.stringify(data) );
    let stamp = Math.floor(Date.now() / 1000)
    localStorage.setItem( cache_id + '.stamp', stamp.toString());
  }
  /**
   * alias of saveCache()
   */
  setCache( cache_id:string, data:any ) {
    return this.saveCache( cache_id, data );
  }
  /**
   * 
   */
  deleteCache( cache_id ) {
    localStorage.removeItem( cache_id );
    localStorage.removeItem( cache_id + '.stamp' );
  }

  /**
   *  
   * Returns cached data after JSON.parse() if exists.
   *
   * 
   * @param id - can be any string.
   * @param expire - seconds in number. If it is 0, then it does not delete the cache. default is 0.
   * 
   * @code
   * let page = this.getCache( cache_id, 20 ); // delete cache data if it's more than 20 seconds.
   * @endcode
   */
  getCache( cache_id:string, expire:number = 0 ) {
    let raw = localStorage.getItem( cache_id );
    if ( raw == null ) return null;
    let data;
    try {
      data = JSON.parse( raw );
    }
    catch ( e ) {
      return null;
    }
    if ( expire == 0 ) return data;
    if ( this.isCacheExpired( cache_id, expire) ) this.deleteCache( cache_id );
    return data; // even though cache expired and deleted, return the cache data. so, next time, it will return null.

    // let cache_stamp = + localStorage.getItem( cache_id + '.stamp' );
    // let stamp = Math.floor(Date.now() / 1000);
    // if ( expire + cache_stamp < stamp ) { // if cache expired, delete cache.
    //   console.info('cache removed');
    //   localStorage.removeItem( cache_id );
    //   localStorage.removeItem( cache_id + '.stamp' );
    // }
    // console.log('cached data will be returned');
    // return data; // even though cache expired and deleted, return the cache data. so, next time, it will return null.
  }

  /**
   * Returns true if the cache is already expired.
   */
  isCacheExpired( cache_id: string, expire: number ) : boolean {
    let cache_stamp = + localStorage.getItem( cache_id + '.stamp' );
    let stamp = Math.floor(Date.now() / 1000);
    if ( expire + cache_stamp < stamp ) { // if cache expired, return true;
      return true;
    }
    else return false;
  }



  http_build_query (formdata, numericPrefix='', argSeparator='') {
    var urlencode = this.urlencode;
    var value
    var key
    var tmp = []
    var _httpBuildQueryHelper = function (key, val, argSeparator) {
      var k
      var tmp = []
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


  urlencode (str) {
    str = (str + '')
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/%20/g, '+')
  }



  getApiEmail( login ) {
    return  login.id + "@philgo.com";
  }
  getApiPassword( login ) {
    return  'Pw+philgo.com@' + login.idx + ',' + login.id + '~' + login.stamp;
  }


  getBirthdayFormValue( data ) {
    let str = '';
    try {
      if ( data.birth_year !== void 0 ) {
        str += data.birth_year + '-';
        str += parseInt(data.birth_month) < 10 ? '0' + data.birth_month : data.birth_month;
        str += '-';
        str += parseInt(data.birth_day) < 10 ? '0' + data.birth_day : data.birth_day;
      }
    }
    catch( e ) {
      console.error('birthday error: ', e );
    }

    return str;

  }


  strip_tags (input, allowed?) {
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')

    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi

    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
    })
  }

}

