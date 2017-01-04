import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';

interface form{
    recipient_id:string,
    subject:string,
    message:string
}

@Component( {
    selector: 'messageform-component',
    templateUrl: 'messageform.html'
})
export class MessageComponent {
    userData;
    messgeForm: form = <form>{}
    @Output() cancel = new EventEmitter();
    @Output() send   = new EventEmitter();

    constructor( private userService : UserService, private postService : PostService
     ){
        this.userService.logged( res =>{
            this.userData = JSON.parse(res);
        })
    }
    onClickCancel(){
        this.cancel.emit()
    }

    onClickSend(){


        if( this.validate() == false ) return;

      let data ={
          'mc': 'message.send',
          'recipient_id': this.messgeForm.recipient_id,
          'subject': this.messgeForm.subject,
          'sender_id' : this.userData.id,
          'message': this.messgeForm.message
      }
      this.postService.query( data , response =>{
          console.log('response ' + response )
          this.messgeForm = <form>{};
          this.send.emit();
      }, err=>alert('error ' + err ) )
        


    }



    validate(){
        if( this.messgeForm.recipient_id == null || this.messgeForm.recipient_id == ''){
            alert('no recipient');
            return false;
        }
        if( this.messgeForm.subject == null || this.messgeForm.subject == '' ){
            alert('no subject' );
            return false;
        }
        if( this.messgeForm.message == null || this.messgeForm.message == ''){
            alert('no message');
            return false;
        }
        return true;
    }


}