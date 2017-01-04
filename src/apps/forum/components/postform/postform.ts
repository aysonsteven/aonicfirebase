import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';



interface form{
  idx: number;
  post  : string;

}
interface data{
    id:string,
    session_id
}
@Component( {
    selector: 'post-component',
    templateUrl: 'postform.html'
})
export class PostComponent {
    post_idx = false;
    postForm: form = <form>{};
    post_index
    userdata:data = <data>{};
    @Input()  mode    : 'post.write';
    @Output() postLoad   = new EventEmitter();
    @Output() error      = new EventEmitter();
    @Output() success    = new EventEmitter();
    @Output() cancel     = new EventEmitter();

    @Input()  posts: any = null;

    constructor( private postService: PostService, private userService: UserService){
        this.userService.logged( res =>{
            this.userdata = JSON.parse(res);
        })
    }
  successCallback( re ) {
    
        try {
            if ( ! this.post_idx ) {
                console.log("posts1: ", this.posts);
                console.log("re:2 ", re);
                this.posts.push( re.data );
            }else{
              console.log('index', this.post_index )
              this.posts.splice( this.post_index, 1, re.post )
            }
        }
        catch ( e ) { alert("Please restart the app." + e ); }
    
    this.postForm = <form>{};
    this.success.emit();
  }

  onClickSubmit(){
      if( this.validate() == false) return alert('no post');
      let data ={
          'mc': 'post.write',
          'post': this.postForm.post,
          'user_id' : this.userdata.id
      }
      this.postService.query( data, response =>{
          console.log('post ' + JSON.stringify(response));
          this.successCallback(JSON.parse(response))
          
      }, err =>alert('Something went wrong ' + err ) )
  }

  validate(){
      if( this.postForm.post == null || this.postForm.post == ''){
          return false;
      }
      return true;
  }



}