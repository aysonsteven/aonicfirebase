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

    pushpost = [];
    @Input() post;
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
      if( this.post ){
          this.postForm.post = this.post.values.post;
      }
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
          this.postForm = <form>{};
          this.posts.push( res );
        //   this.restructureData( res )
        }, error => alert('Something went wrong ' + error) )
  }

  restructureData( data ){
      console.log('data ' + JSON.parse(data))
        if ( data == void 0 || data == '' ) return;
        // this.waitingList = false
        for( let key of Object.keys(data) ) {
            this.pushpost.push ( {'key':key, 'values':data[key]} );
            // this.searchedItem.push( {key: key, value: data[key]} );
        }
        console.info('checking restructured () ' + JSON.stringify(this.pushpost))
  }

  
  validate(){
      if( this.postForm.post == null || this.postForm.post == ''){
          return false;
      }
      return true;
  }



}