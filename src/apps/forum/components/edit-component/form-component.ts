import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';



interface form{
  idx: number;
  comment  : string;
  parent_idx: number;

}
interface data{
  id:string,
  session_id
}
@Component( {
  selector: 'form-component',
  templateUrl: 'form-component.html'
})
export class EditFormComponent implements OnInit {
  userData:data = <data>{};
  commentForm: form = <form>{};
  post_idx = false;
  post_index;
  // @Input()  mode    : 'comment.write';
  @Output() postLoad   = new EventEmitter();
  @Output() error      = new EventEmitter();
  @Output() success    = new EventEmitter();
  @Output() cancel     = new EventEmitter();
  @Input()  posts: any = null;
  @Input() parentIDX;
  @Input() current = null;
  @Input() post;
  constructor(
    private postService : PostService,
    private userService : UserService,
    private ngZone      : NgZone
  ) {

  }


  successCallback( re ) {

    try {


      // if ( ! this.current ) {
      console.log("posts1: ", JSON.stringify(this.posts));
      console.log("re:2 ", JSON.stringify(re));
      this.posts.unshift( JSON.parse(re).data );

      // }else{
      //   console.log('index', this.post_index )
      //   this.posts.splice( this.post_index, 1, re.post )
      // }
    }
    catch ( e ) { alert("Please restart the app." + e ); }

    this.commentForm = <form>{};

    this.success.emit();

  }

  ngOnInit() {
    if( this.current ){
      this.commentForm.comment = this.current.values.comment;
    }

  }






  onEnterComment(event){
    if( event.keyCode == 13){
      if( !this.current ){
        this.writeComment( );
        return;
      }
      this.editComment( )

    }
  }

  editComment(){

    this.current.values.updated = this.postService.getCurrentDate();
    this.current.values.comment = this.commentForm.comment
    this.postService.edit( 'comments/' + this.post.key , this.current.key, this.current.values, res =>{
      console.log('edited ' )
      this.success.emit();
    }, err=>alert('something went wrong ' + err ) )
  }

  writeComment(){
    console.log('post ' + this.parentIDX)
    let data = {
      'uid': localStorage.getItem('aonic_firebase_session'),
      'comment' : this.commentForm.comment,
      'created': this.postService.getCurrentDate(),

    }
    this.postService.createcomment( this.parentIDX, 'comments', data , res =>{
      console.log('comment res ' + JSON.stringify(res) )
      console.log('posts ' + JSON.stringify( this.posts))
      let returndata = JSON.parse(JSON.stringify(res));
      this.renderWriteComment( returndata )
      this.success.emit();

    }, error => alert('something went wrong ' + error ) )
  }

  renderWriteComment( data ){
    this.ngZone.run( () =>{
      this.posts.unshift( data )
    })
  }





}
