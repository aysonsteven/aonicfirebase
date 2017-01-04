import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PostService } from '../../../services/post.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
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
    url:string = 'http://work.org/forum-backend/index.php/?mc=user.upload'
    uploader;
    userData;
    showForm:boolean = false;
    opt = {};
    posts;
    constructor( private postService: PostService, private userService: UserService ){
        this.uploader = new FileUploader({ url:this.url });
        console.info('user logged ')
        
        this.userService.logged( res =>{
            this.userData = JSON.parse(res);
        })
        console.log('login data '+  this.userData )
        this.getPostList();
    }


 onChangeFile(event){
     console.log('file ' + JSON.stringify(event.target.files))
 }
onClickAddComment(){
    console.log('add comment');
}

  getPostList(){
    this.opt={
      'mc' : 'post.fetch',
      'options': {
        'orderby':'idx DESC'
        }
    }
    this.postService.query( this.opt, res=>{
      this.posts = res
      let arr = _.values(res.data.rows)
      console.log( 'posts ' + this.posts )
    //   this.loading = false;
    this.posts = JSON.parse(res).data;
    }, e=>{
        this.posts = JSON.parse(e).data;
        console.log('posts ' + this.posts)
    })
  }


  onClickDelete( post, index){
      if( this.userData.id != post.user_id) alert('not your post');
      let data = [];
      data['idx'] = post.idx;
      data['mc'] = 'post.delete'
      console.log('idx ' + post.idx)
    // let confirmDelete = confirm('are you sure you want to delete');
    // if( confirmDelete == false ) return;
    this.postService.query( data  , response =>{
        this.posts.splice( index, 1 )
    }, err =>console.info('Something went wrong ' + err ) )

  }

  editComponentOnSuccess(){
      this.showForm = true;
  }

}