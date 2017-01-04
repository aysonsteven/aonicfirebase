import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
    post_index
    // @Input()  mode    : 'comment.write';
    @Output() postLoad   = new EventEmitter();
    @Output() error      = new EventEmitter();
    @Output() success    = new EventEmitter();
    @Output() cancel     = new EventEmitter();
    @Input()  posts: any = null;
    @Input() parentIDX;
    @Input() current;
       constructor(
        private postService : PostService,
        private userService : UserService
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
            this.commentForm.comment = this.current.comment;
        }

    }






    onEnterComment(event){
        if( event.keyCode == 13){
            if( !this.current ){
                this.writeComment( event );
                return;
            }
            this.editComment( event )
            
        }
    }

    editComment(event){
        console.log('id ' + this.current.user_id)
        let data ={
            'mc': 'comment.edit',
            'idx': this.current.idx,
            'comment': event.target.value,
            'userid' : this.current['user_id'],
            'parent_idx': this.parentIDX
        }
        
       

        this.postService.query( data, response =>{
            this.commentForm = <form>{};
            console.log('comment data ' + JSON.stringify(response) + "comments " + JSON.stringify(this.posts));
            let data = JSON.parse(response);
            console.log('checking format ' + JSON.stringify(data))
            

            this.posts.unshift(data.data)
            
        }, err =>alert('Something went wrong ' + err ) )

    }

    writeComment(event){
        console.log('comment ' + event.target.value)
      let data ={
          'mc': 'comment.write',
          'comment': this.commentForm.comment,
          'userid' : this.userData.id,
          'parent_idx': this.parentIDX
      }
      this.postService.query( data, response =>{
          this.commentForm = <form>{};
          console.log('comment data ' + JSON.stringify(response) + "comments " + JSON.stringify(this.posts));
          let data = JSON.parse(response);
          console.log('checking format ' + JSON.stringify(data))
          this.successCallback(response);
          
      }, err =>alert('Something went wrong ' + err ) )
    }


    


}