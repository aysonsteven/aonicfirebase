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
    commenttoedit;
    postIDX;
    comments;
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
        
    }

    ngOnInit() { 
        this.getPostOwnerData();
    }

  getCommentList(){
      this.postService.gets( 'comments', res=>{
        this.displayComments( res );
      })
  }
  displayComments( data ){
        console.log('first comments strucat ' + JSON.stringify(data))
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


    renderData( res ){
        this.ngZone.run(() =>{
            this.userdata = res;
            console.log('data ' + JSON.stringify(this.userdata))
        })
    }

    getPostOwnerData(){
        this.userService.get( this.post.values.uid , res =>{
            this.renderData( res )
        }, error =>alert('error'))
    }
    onClickAddComment(){
       if( this.showForm == false) return this.showForm = true;
       this.showForm = false;
    }
    editComponentOnSuccess(){
        this.postEdit = false;
    }

    onClickEditComment(comment, index){
        // console.log('user_id ' + comment.user_id)
        // this.showForm = true;
        // this.commenttoedit = comment;
        // this.comments.splice(index, 1)

        

        
    }
    onClickEdit(){
        console.log('uid ' + this.post.key)
        // this.editpost.emit();
        this.postEdit = true;
        // this.editpost.emit();
    }

    onCancelEditPost(){
        this.postEdit = false;
    }

 


    


}