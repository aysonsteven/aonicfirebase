import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import * as _ from 'lodash';


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
export class PostViewComponent {
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
        this.userService.logged( res =>{
            this.userData = JSON.parse(res);
        })
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
      let opt ={}
    opt={
      'mc' : 'comment.search',
      'options': {
          'cond': "parent_idx = '" + this.postIDX +"'",
        'orderby':'idx DESC'
        }
    }
    this.postService.query( opt, res=>{
      this.comments = res
      let arr = _.values(res.data.rows)
      console.log( 'posts ' + this.comments )
    //   this.loading = false;
    }, e=>{
        this.comments = JSON.parse(e).data.rows;
        console.log('posts ' + this.comments)
    })
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
      if( this.userData.id != comment.user_id) return alert('not your comment');
      let data = [];
      data['idx'] = comment.idx;
      data['mc'] = 'comment.delete'
      console.log('idx ' + comment.idx)
    let confirmDelete = confirm('are you sure you want to delete');
    if( confirmDelete == false ) return;
    this.postService.query( data  , response =>{
        this.comments.splice(index, 1)
    }, err =>console.info('Something went wrong ' + err ) )
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