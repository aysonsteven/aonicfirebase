import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PostService } from '../../../services/post.service';
import { Router } from '@angular/router';



@Component( {
    selector: 'forummessage-page',
    templateUrl: 'forummessage.html'
})
export class ForumMessagePage {
    userid;
    userData;
    messages;
    showMessageForm;
    constructor( private postService : PostService, private userService : UserService ){
        this.userService.logged( res =>{
            this.userData = JSON.parse( res );
        })
        this.getMessageList();
    }
    onEmitCancel(){
        this.showMessageForm = false;
    }
    onClickHideContent( message ){
        message['show_content'] = false;
    }
     onClickShowContent(message){
        if( message['show_content'] == false) return message['show_content'] = true;
        message['show_content'] = false;
    }
    onEmitSend(){
        this.showMessageForm = false;
    }
    ngOnInit() {
        this.userid = this.userData.id;
    }
    getMessageList(){
        console.log('userid ' + this.userData.id)
        let opt={
        'mc' : 'message.search',
        'options': {
            'cond': "recipient_id = '" + this.userData.id +"'",
            'orderby':'idx DESC'
            }
        }
        this.postService.query( opt, res=>{
        this.messages = res
        console.log( 'posts ' + this.messages )
        //   this.loading = false;
        this.messages = JSON.parse(res).data.rows;
        }, e=>{
            this.messages = JSON.parse(e).data;
            console.log('posts ' + this.messages)
        })
    }
    
}