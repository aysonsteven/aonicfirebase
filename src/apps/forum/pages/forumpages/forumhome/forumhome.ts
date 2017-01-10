import { Component, NgZone, Renderer, OnDestroy  } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PostService } from '../../../services/post.service';
import { PostTest } from '../../../services/unit-test/post-test';
import { Router } from '@angular/router';
import * as _ from 'lodash';


export interface FileUploadResponse {
  success: boolean;
  item: any;
  response: any;
  status: any;
  headers: any;
};

export interface FILE_UPLOAD_RESPONSE  {
  data: FILE_UPLOAD_DATA;
};


export interface FILE_UPLOAD_DATA {
  code: string;
  idx: number;
  name: string;
  path: string;
  result: number;
  error?: string;
  src_org: string;
  url: string;
  url_thumbnail: string;
  gid?: string; // @Warning 'gid' is not returned from server. you must keep it by yourself.
};

@Component( {
  selector: 'forumhome-page',
  templateUrl: 'forumhome.html'
})


export class ForumHomePage {
  noMorePosts: boolean = false;
  inPageLoading:boolean = false;
  scrollListener = null;
  scrollCount = 0;
  showPostEdit:boolean = false;
  url:string = 'http://work.org/forum-backend/index.php/?mc=user.upload'
  uploader;
  userData;
  showForm:boolean = false;
  opt = {};
  posts = [];
  session
  constructor( private postService: PostService,
               private userService: UserService,
               private router: Router,
               private ngZone : NgZone,
               private testPost: PostTest,
               private renderer: Renderer
  ){
    this.postService.resetPagination();
    // this.testPost.test_all();
    console.log('login data '+  this.session )
    this.loadPost();
    this.checklogin();
    this.getUserData();
    this.beginScroll();

  }




  displayPosts(data?) {
    if ( data == void 0 || data == '' ) return;
    // this.waitingList = false
    for( let key of Object.keys(data).reverse() ) {
      this.posts.push ( {'key':key, 'values':data[key]} );
      // this.searchedItem.push( {key: key, value: data[key]} );
    }
    console.info('posts ' + JSON.stringify(this.posts))
  }

  /**
   * @description getting another set of posts when the user scrolled down.
   */
  getPostList(){
    if ( this.inPageLoading ) {
      console.info("in page loading");
      return;
    }
    this.inPageLoading = true;
    this.postService.page( 'posts', res=>{
      console.log('res :' + res)
      this.displayPosts( res )
      this.inPageLoading = false;
      // console.log('posts ' + JSON.stringify(res))
    }, error => alert('Something went wrong ' + error ) )
  }

  /**
   * loading post list for the first time with limit.
   */
  loadPost(){
    this.inPageLoading = true;
    this.postService.gets( 'posts', res=>{
      console.log('res :' + res)
      this.displayPosts( res )
      this.inPageLoading = false;
      // console.log('posts ' + JSON.stringify(res))
    }, error => {
      alert('Something went wrong ' + error )
      this.inPageLoading = false;
    } )
  }

  /**
   * @description this will delete the selected post from firebase database and also remove the post from array,
   *    so post list will be updated without requesting another bunch of post list.
   * @param post this is the selected post to be deleted.
   * @param index this is the index of the selected post from the array.
   *
   */
  onClickDelete( post, index){
    console.log('post' + post.key)
    this.postService.delete('posts', post.key , result =>{
      this.posts.splice( index, 1 )
    }, error=> alert( 'something went wrong ' + error ) )
  }
  ///bind userdata
  renderPage(res){
    this.ngZone.run(() =>{
      this.userData = res
    })
  }

  /**
   * @description getting the information of the logged in user.
   */
  getUserData(){
    if( this.session ){
      this.userService.get( this.session , res=>{

        this.renderPage(res);
        // console.log('userid ' + this.userData.id)
      }, error => alert('Something went wrong ' + error))
    }
  }

  editComponentOnSuccess(){

  }

  /**
   *
   * checking if there is someone logged in.
   *
   */
  checklogin(){
    this.userService.checklogin( res =>{
      this.session = res;
      console.log('logged in ' + res )
    }, () =>{
      alert('not logged in');
      this.router.navigate(['login'])
    })
  }

  onClickEditPost( post ){
    console.log('edit post home ' + post.key)
    this.showForm = true;
  }
  onCancelEditPost(){
    this.showForm = false;
  }


  beginScroll() {
    this.scrollListener = this.renderer.listenGlobal( 'document', 'scroll', _.debounce( () => this.pageScrolled(), 200));
  }
  endScroll() {
    if ( this.scrollListener ) this.scrollListener();
  }
  pageScrolled() {
    let pages = document.querySelector(".pages");
    if ( pages === void 0 || ! pages || pages['offsetTop'] === void 0) return; // @attention this is error handling for some reason, especially on first loading of each forum, it creates "'offsetTop' of undefined" error.
    let pagesHeight = pages['offsetTop'] + pages['clientHeight'];
    let pageOffset = window.pageYOffset + window.innerHeight;
    if( pageOffset > pagesHeight - 100) { // page scrolled. the distance to the bottom is within 200 px from
      console.log("page scroll reaches at bottom: pageOffset=" + pageOffset + ", pagesHeight=" + pagesHeight);
      this.getPostList();
    }
  }

  /**
   *
   * @description end scroll on destroy.
   *
   */
  ngOnDestroy() {
    this.endScroll();
  }

}
