import { Component,  OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'comment-component',
    templateUrl: 'comment.component.html'
})

export class CommentComponent{
    editform:boolean = false;
        commenttoedit;
    session
    commentuid;
    @Input() post;
    @Input() mode;
   @Input() comment  = null;
   @Output() delete    = new EventEmitter();
   @Output() createcomment = new EventEmitter();
   @Output() editpost = new EventEmitter();

   constructor( private userService : UserService , private ngZone: NgZone){
               this.session = localStorage.getItem('aonic_firebase_session')
       setTimeout( () =>{
         this.getCommentAuthor();
       }, 200);

   }


    ngOnInit() {
    }

    onSuccessComment(){
        this.editform = false;
    }

   getCommentAuthor(){
        this.userService.get( this.comment.values.uid , res =>{
            this.renderAuthor( res )
        }, error =>alert('error'))
   }

   renderAuthor( data ){
       this.ngZone.run(() =>{
           this.commentuid = data;
       })
       console.log('author ' + JSON.stringify( this.commentuid))
   }

   onClickEditComment(){
       this.editpost.emit();
       this.editform = true;
   }


   onCliclDeleteComment(){
       let confirmdelete = confirm('Are you sure you want to delete?')
       if( confirmdelete == false ) return;
       this.delete.emit();
   }
}
