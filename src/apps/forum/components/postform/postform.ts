import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
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

    constructor( private postService: PostService, private userService: UserService, private ngZone : NgZone){

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
  onClickCancelEdit(){
      this.cancel.emit();
  }

  /**
   * onClickSubmit() button
   * if the post exist it will run update() method. otherwise it'll run write() method
   */
  onClickSubmit(){
      if( this.post ){
          this.update();
          return;
      }
      this.writepost();

  }

  /**
   * this will save posts to firebase database
   * using PostService write method with the required parameters.
   */
  writepost(){
      let data = {
          post: this.postForm.post,
          created: Date.now(),
          uid: localStorage.getItem('aonic_firebase_session')
      }
      if( this.validate() == false) return alert('no post');
      this.postService.write( 'posts', data , res =>{
          let postdata = JSON.parse(JSON.stringify(res))
          console.log( 'result ' + JSON.stringify(res) );
          console.log('posts ' + JSON.stringify(this.posts));
          this.renderPost( postdata )
        }, error => alert('Something went wrong ' + error) )
        this.postForm = <form>{};
  }

  /**
   *
   * @param data {object} this  is the new post object
   * @description renderPost method is used to unshift or add the new post to the list,
   *    without requesting another list of post from the server.
   * @description in this method i used NgZone an injectable method or service,
   *    that is used to optimize performance when performing asynchronous tasks.
   */
  renderPost( data ){
    this.ngZone.run(()=>{
      this.posts.unshift( data )
    })
  }

  /**
   * this will update an existing post from firebase database
   * using PostService write method which accepts parameters
   * @param 'posts' {string} this is the database reference
   * @param this.post.key {string} this is the key of the post to be edited.
   * @param this.post.values new value/data for the selected post.
   */
  update(){
      console.log('post update ::: ' + JSON.stringify( this.post ))
      this.post.values.updated = Date.now();
      this.post.values.post = this.postForm.post;
      this.postService.edit( 'posts', this.post.key, this.post.values, res =>{
          console.log('updated successfully ' + JSON.stringify(res) )
          this.success.emit();
      }, error => alert("something went wrong " + error ) )
  }



//validation
  validate(){
      if( this.postForm.post == null || this.postForm.post == ''){
          return false;
      }
      return true;
  }



}
