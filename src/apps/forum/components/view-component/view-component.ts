import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
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
  selector: 'view-component',
  templateUrl: 'view-component.html'
})
export class PostViewComponent implements OnInit {
  postEdit:boolean = false;
  userdata;
  postIDX;
  comments = [];
  showForm:boolean = false;
  isPost:boolean = false;
  session;
  @Input() postidx;
  @Input() mode;
  @Input() post  = null;
  @Output() delete    = new EventEmitter();
  @Output() comment = new EventEmitter();
  @Output() editpost = new EventEmitter();
  constructor(
    private postService : PostService,
    private userService : UserService,
    private ngZone : NgZone
  ) {
    this.session = localStorage.getItem('aonic_firebase_session')
    setTimeout(() =>{
      this.getCommentList();
    }, 200);

  }


  onSuccessComment(){
    this.showForm = false;
  }

  ngOnInit() {
    this.getPostOwnerData();
  }


  /**
   * getting comment list from firebase database  using gets() method.
   * gets() method accepts parameter database reference.
   * which is 'comments/' and the post key of the parent post. of the comment.
   */
  getCommentList(){
    if( ! this.post ) return;
    this.postService.gets( 'comments/'+ this.post.key , res=>{
      this.displayComments( res );
    }, error =>alert('Something went wrong ' +error ) )
  }

  /**
   * @description structuring retrieved data from firebase databse for displaying.
   * @param data {object} these are the datas retrieved from firebase database.
   */
  displayComments( data ){
    if ( data == void 0 || data == '' ) return;
    // this.waitingList = false
    for( let key of Object.keys(data) ) {
      this.comments.push ( {'key':key, 'values':data[key]} );
      // this.searchedItem.push( {key: key, value: data[key]} );
    }
    console.info('comments ' + JSON.stringify(this.comments))
  }


  onClickDelete() {
    let confirmdelete = confirm('Are you sure you want to delete?')
    if( confirmdelete == false ) return;
    this.delete.emit()
  }


  /**
   *
   * getting the author of post
   *
   */

  getPostOwnerData(){
    if( ! this.post ) return;
    this.userService.get( this.post.values.uid , res =>{
      this.renderData( res )
    }, error =>alert('error'))
  }

  /**
   *
   * @description binding the retrieved userdata
   *
   */
  renderData( res ){
    this.ngZone.run(() =>{
      this.userdata = res;
      console.log('data ' + JSON.stringify(this.userdata))
    })
  }

  /**
   *
   * @returns {boolean} showForm this will determin if the edit-component will show
   * @description if the showForm is true it will change the value to false so it'll work as toggle.
   */
  onClickAddComment(){
    if( this.showForm == false) return this.showForm = true;
    this.showForm = false;
  }
  editComponentOnSuccess(){
    this.postEdit = false;
  }

  /**
   * this is the method for editing post,
   * this will change postEdit to true that will make the postform component show.
   *
   */
  onClickEdit(){
    console.log('uid ' + this.post.key)
    this.postEdit = true;
    this.showForm = false;
  }

  onCancelEditPost(){
    this.postEdit = false;

  }

  checklogin(){
    this.userService.checklogin( res =>{
      this.userdata = res;
    },  () => console.log(' nocallback '))
  }

  /**
   * @description this is the delete comment that accepts the delete event emit.
   * @param comment this is the selected comment that is about to be deleted.
   * @param index this is the index of the selected comment from the array.
   */
  onClickDeleteComment(comment, index){
    this.postService.delete( 'comments/' + this.post.key, comment.key, res=>{
      console.log('deleted')
      this.comments.splice(index ,1)
    }, error =>alert('error ' + error))
  }

  onCancelComment(){
    this.showForm = false;
  }





}
