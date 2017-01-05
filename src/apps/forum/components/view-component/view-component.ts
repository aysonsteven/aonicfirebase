import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
    commenttoedit;
    postIDX;
    comments
    showForm:boolean = false;
    isPost:boolean = false;
    userData;
    @Input() postidx;
    @Input() mode;
   @Input() post  = null;
   @Output() delete    = new EventEmitter();
   @Output() comment = new EventEmitter();
       constructor(
        private postService : PostService,
        private userService : UserService
    ) { 

        setTimeout(() =>{
           this.getCommentList(); 
        }, 200);
        
    }


    onSuccessComment(){
        
    }

    ngOnInit() { 
        this.postIDX = this.post.idx;
        console.log('postidx ' + this.post.idx)

        try {
            if ( this.post === null ) return alert("View Component Error: post is null");
        }
        catch ( e ) {
            console.info("CATCH : ViewComponent::ngOnInit() idx_parent failed?");
        }


    }

  getCommentList(){

    // console.info('check post idx' + this.post.idx)
  }

    // onClickReply() {
    //     this.active = true;
    //     this.mode = 'create-comment';
    //     this.editComponent.initForm( this.mode );
    // }

    // onClickEdit() {
    //     console.log("ViewComponent::onClickEdit()", this.editComponent );
    //     this.active = true;
    //     this.hideContent = true;
    //     if ( this.post.idx == '0' ) this.mode = 'post-edit';
    //     else this.mode = 'edit-comment';
    //     this.editComponent.initForm( this.mode );
    // }

    onClickDelete() {
        let confirmdelete = confirm('Are you sure you want to delete?')
        if( confirmdelete == false ) return;
            this.delete.emit()   
    }

    onCliclDeleteComment( comment, index){

    }

    onClickAddComment(){
        this.showForm = true;
    }

    onClickEditComment(comment, index){
        console.log('user_id ' + comment.user_id)
        this.showForm = true;
        this.commenttoedit = comment;
        this.comments.splice(index, 1)

        
    }
    

 


    


}