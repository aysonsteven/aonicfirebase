import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';



interface form{
  idx: number;
  post  : string;

}
interface data{
    id:string,
    session_id,
    firstname,
    lastname
}
@Component( {
    selector: 'post-component',
    templateUrl: 'postform.html'
})
export class PostComponent implements OnInit {
    post_idx = false;
    postForm: form = <form>{};
    post_index
    userdata:data = <data>{};
    @Input() loggedinuser;
    @Input()  mode    : 'post.write';
    @Output() postLoad   = new EventEmitter();
    @Output() error      = new EventEmitter();
    @Output() success    = new EventEmitter();
    @Output() cancel     = new EventEmitter();

    @Input()  posts: any = null;

    constructor( private postService: PostService, private userService: UserService){

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
  ngOnInit(){

  }

  onClickSubmit(){
      let data = {
          post: this.postForm.post,
          created: Date.now(),
          uid: localStorage.getItem('aonic_firebase_session')
      }
      if( this.validate() == false) return alert('no post');
      this.postService.create( data , res =>{
          console.log( 'result ' + JSON.stringify(res) );
          console.log('posts ' + JSON.stringify(this.posts))
        }, error => alert('Something went wrong ' + error) )
  }

  
  validate(){
      if( this.postForm.post == null || this.postForm.post == ''){
          return false;
      }
      return true;
  }



}