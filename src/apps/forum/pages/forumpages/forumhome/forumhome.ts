import { Component, NgZone } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PostService } from '../../../services/post.service';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';


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
    url:string = 'http://work.org/forum-backend/index.php/?mc=user.upload'
    uploader;
    userData;
    showForm:boolean = false;
    opt = {};
    posts;
    session
    constructor( private postService: PostService, private userService: UserService, private router: Router, private ngZone : NgZone ){
        this.uploader = new FileUploader({ url:this.url });
        console.info('user logged ')
        console.log('login data '+  this.session )
        this.getPostList();
        this.checklogin();
        this.getUserData();
    }


    onChangeFile(event){
        console.log('file ' + JSON.stringify(event.target.files))
    }
    onClickAddComment(){
        console.log('add comment');
    }

    getPostList(){

    }


    onClickDelete( post, index){


    }

    renderPage(res){
        this.ngZone.run(() =>{
            this.userData = res
        })
    }

    getUserData(){
        if( this.session ){
            this.userService.get( this.session , res=>{
                
                this.renderPage(res);
                console.log('userid ' + this.userData.id)
            }, error => alert('Something went wrong ' + error))
        }
    }

    editComponentOnSuccess(){
        this.showForm = true;
    }

  checklogin(){
      this.userService.checklogin( res =>{
          this.session = res;
          console.log('logged in ' + res )
      }, () =>{
          alert('not logged in');
          this.router.navigate(['login'])
        })
  }

}