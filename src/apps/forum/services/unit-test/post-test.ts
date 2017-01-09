import { Injectable } from '@angular/core';
import { PostService } from '../post.service';
import { Test } from './test';

interface value{
  key
  values:{
    post:string;
    created;
    uid: string;
  }
}
@Injectable()

export class PostTest extends Test{
  values: value = <value>{};
  constructor( private postService: PostService){
    super();


  }


  test_all(){
    for( let ctr = 0; ctr <= 20; ctr ++){
      let data = {
        'post' : 'POST TEST no. ' + ctr,
        'created' : Date.now(),
        'uid': localStorage.getItem('aonic_firebase_session')
      }
      this.create_test( data, ()=>{
        this.edit_test( ()=>{
          this.delete_test()
        })
      })
    }


  }
  create_test(data, callback ){
    this.postService.write( 'posts', data, res =>{
      this.values = res;
      Test.passed('created' + data.post);
      callback();
    }, err => Test.failed('failed to post'))
  }


  delete_test(){
    this.postService.delete('posts', this.values.key, res =>{
      Test.passed('passed');
    }, err=>Test.failed('failed to delete ' + err))
  }

  edit_test(callback){
      this.values.values.post = 'edited post'
    this.postService.edit('posts', this.values.key, this.values.values , res =>{
          Test.passed('passed edit');
          callback();
    }, err =>Test.failed('failed to edit'))
  }

}
