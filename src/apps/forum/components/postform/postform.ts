import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { Data } from '../../services/data';



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

interface filedata{
    post:string;
    created;
    uid:string;
    photo:string;
    ref:string;
}

@Component( {
    selector: 'post-component',
    templateUrl: 'postform.html'
})
export class PostComponent implements OnInit {
    active:boolean = false;
    progress_bar:boolean = false;
    position;
    refPhoto;
    urlPhoto:string;
    post_idx = false;
    postForm: form = <form>{};
    post_index
    userdata:data = <data>{};

    pushpost = [];

  /**
   * inputs
   */
    @Input() inputURL:string;
    @Input() post;
    @Input() loggedinuser;
    @Input() ref:string;
    @Input()  mode    : 'post.write';

  /**
   *
   * @type {EventEmitter}
   */
  @Output() postLoad   = new EventEmitter();
    @Output() error      = new EventEmitter();
    @Output() success    = new EventEmitter();
    @Output() cancel     = new EventEmitter();


    @Input()  posts: any = null;

    constructor(
        private postService: PostService,
        private userService: UserService,
        private ngZone : NgZone,
        private data : Data
    ){
    }


    onClickActivatePost( textarea ){
        this.active = true;
        textarea
    }


  ngOnInit(){
      if( this.ref ) this.refPhoto = this.ref;
      if( this.inputURL ) this.urlPhoto = this.inputURL;
      if( this.post ){
          this.postForm.post = this.post.values.post.replace(/(?:<br >)/g, '\n');
          this.active = true;
      }
  }
  onClickCancelEdit(){
      this.active = false;
      if( this.post) this.cancel.emit();
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
   * @description used regex replace()to change regular expretion breakline \n to <br >
   */
  writepost(){
      if( this.validate() == false) return alert('no post');
      let data: filedata = <filedata>{}
          data.post = this.postForm.post.replace(/(?:\r\n|\r|\n)/g, '<br >'),
          data.created = this.postService.getCurrentDate(),
          data.uid = localStorage.getItem('aonic_firebase_session')
      if( this.urlPhoto ) {
        data.photo = this.urlPhoto;
        data.ref = this.refPhoto;
      }
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
   * @description in this method NgZone is an injectable method or service,
   *    that is used to optimize performance when performing asynchronous tasks.
   */
  renderPost( data ){
    this.ngZone.run(()=>{
      this.posts.unshift( data )
      this.urlPhoto = null;
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
      this.post.values.updated = this.postService.getCurrentDate();
      this.post.values.post = this.postForm.post.replace(/(?:\r\n|\r|\n)/g, '<br >');
      if( this.urlPhoto ){
        this.post.values.photo = this.urlPhoto;
        this.post.values.ref = this.refPhoto;
      }
      else{
        this.post.values.photo = null;
        this.post.values.ref = null;
      }
      this.postService.edit( 'posts', this.post.key, this.post.values, res =>{
          console.log('updated successfully ' + JSON.stringify(res) )
          this.success.emit();
      }, error => alert("something went wrong " + error ) )
  }


  /**
   * @description validating post.
   * @returns {boolean} returns false if not passed, true if passed.
   */
  validate(){
      if( this.postForm.post == null || this.postForm.post == ''){
          return false;
      }
      return true;
  }


  /**
   *
   * @description uploads files to firebase storage on change event.
   *
   */

  onChangeFile( $event ){
        let file = $event.target.files[0];
        console.log("Console:file: ",file);
        if( file == void 0) return;
        this.ngZone.run(() =>{
          this.progress_bar = true;
        })

        let ref = 'photo/' + Date.now() + '/' + file.name;
        console.log( 'file ' ,  file  )


        this.data.upload( { file: file, ref: ref }, uploaded=>{
            console.log('url ' + uploaded.url)
            this.renderUploadedPhoto( uploaded.url, uploaded.ref )

        }, error=>{
            alert('Error'+ error);
        },
        percent=>{
            this.renderPage( percent );

        } );
    }

  /**
   *
   * @description this method will delete files on firebase storage using the reference key of the selected file.
   *
   *
   */
  onClickDeleteFile( ){
      let confirmdelete = confirm('Are you sure you wnat to delete this photo? ' );
      if( confirmdelete == false ) return;
      this.data.delete( this.refPhoto ,  () =>{
        console.log('successfully deleted');
        this.renderUploadedPhoto( null, null);
      }, err => alert('Something went wrong ' +err ) )
    }
    renderPage( percent ) {
      this.ngZone.run(() => {
        this.position = percent;
      });
    }
    renderUploadedPhoto( url, ref ){
        this.ngZone.run(() =>{
          this.urlPhoto = url;
          this.refPhoto = ref;
          this.progress_bar = false;
        })
    }



}
