import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { Data } from '../../services/data';



interface form{
  idx: number;
  comment  : string;
  parent_idx: number;

}

interface filedata{
    comment:string;
    created;
    uid:string;
    photo:string;
    ref:string;
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
  refPhoto;
  urlPhoto:string;
  position;
  progress_bar:boolean = false;
  active:boolean = false;
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
  @Input() inputURL:string;
  @Input() ref:string;
  constructor(
    private postService : PostService,
    private userService : UserService,
    private ngZone      : NgZone,
    private data        : Data
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
    if( this.ref ) this.refPhoto = this.ref;
    if( this.inputURL ) this.urlPhoto = this.inputURL;
    if( this.current ){
      this.commentForm.comment = this.current.values.comment.replace(/(?:<br >)/g, '\n');
      this.active = true;
    }

  }
  onClickDeleteFile( ){
      let confirmdelete = confirm('Are you sure you wnat to delete this photo? ' );
      if( confirmdelete == false ) return;
      this.data.delete( this.refPhoto ,  () =>{
        console.log('successfully deleted');
        this.renderUploadedPhoto( null, null);
      }, err => alert('Something went wrong ' +err ) )
    }

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









  editComment(){

    this.current.values.updated = this.postService.getCurrentDate();
    this.current.values.comment = this.commentForm.comment.replace(/(?:\r\n|\r|\n)/g, '<br >');
      if( this.urlPhoto ){
        this.current.values.photo = this.urlPhoto;
        this.current.values.ref = this.refPhoto;
      }
      else{
        this.current.values.photo = null;
        this.current.values.ref = null;
      }
    this.postService.edit( 'comments/' + this.post.key , this.current.key, this.current.values, res =>{
      console.log('edited ' )
      this.success.emit();
    }, err=>alert('something went wrong ' + err ) )
  }

  validate(){
    if( this.commentForm.comment == '' || this.commentForm == null) return alert('no content!');
  }

  writeComment(){
    if( this.commentForm.comment == '' || this.commentForm.comment == null) return alert('no content!');
    console.log('post ' + this.parentIDX)
    let data : filedata = <filedata>{};
    data.uid = localStorage.getItem('aonic_firebase_session');
    data.comment = this.commentForm.comment.replace(/(?:\r\n|\r|\n)/g, '<br >');
    data.created = this.postService.getCurrentDate()
    if( this.urlPhoto ){
      data.photo = this.urlPhoto;
      data.ref = this.refPhoto;
    }
    this.postService.createcomment( this.parentIDX, 'comments', data , res =>{
      console.log('comment res ' + JSON.stringify(res) )
      console.log('posts ' + JSON.stringify( this.posts))
      let returndata = JSON.parse(JSON.stringify(res));
        this.ngZone.run(() =>{
          this.posts.unshift( returndata )
          this.commentForm = <form>{};
          this.active = false;
          this.urlPhoto = null;
        })
      this.success.emit();

    }, error => alert('something went wrong ' + error ) )
  }

  // renderWriteComment( data ){
  //   this.ngZone.run( () =>{
      
  //   })
  // }

  onClickSubmit(){
      if( !this.current ){
        this.writeComment( );
        return;
      }
      this.editComment( )

    }
  onClickCancel(){
    this.commentForm = <form>{};
    this.cancel.emit();
    this.active = false;
  }
  onClickActivateComment(){
    this.active = true;
  }





}
