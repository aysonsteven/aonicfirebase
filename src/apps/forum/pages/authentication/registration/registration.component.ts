import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

interface form{
    id:string,
    password:string,
    email:string,
    gender: string,
    age: number,
    birthdate: string
}
@Component( {
    selector: 'registration-page',
    templateUrl: 'registration.component.html'
})
export class RegistrationPage {
    urlPhoto:string
    button_title;
    user_session;
    userdata
    registration_form:form = <form>{};
    constructor( public userService: UserService, public router: Router ){
        this.userService.logged( res=>{
            this.user_session = JSON.parse(res);
         console.log('usersession ' + JSON.stringify(this.user_session))
         
        })
        if( this.user_session ) this.getUserData();
        if( this.user_session )  this.button_title = 'update';
        else this.button_title = 'register';
    }

    getUserData(){
        let data = {
            'mc': 'user.get',
            'idx' : this.user_session.idx
        }
        this.userService.query( data, res=>{
            this.userdata = res;
            console.log('userdara ' + this.userdata.email)
        }, err=> alert('error ' + err ) )
    }

    onChangeFile( $event ){
        let file = $event.target.files[0];
        console.log( 'file ' ,  file  )
    }
    ngOnInit(){
        if( this.user_session ){
            setTimeout(() =>{
                console.info('userData '  + JSON.stringify(this.user_session))
                this.urlPhoto  = this.userdata.photo;
                this.registration_form.id = this.user_session.id;
                this.registration_form.age = this.userdata.age;
                this.registration_form.email = this.userdata.email;
                this.registration_form.gender = this.userdata.gender;
            }, 100);

        }
    }
    onClickRegister(){
        if(! this.user_session ){
            this.register();
            return;
        }
        this.update();

    }
    update(){
      let data ={

          'mc': 'user.edit',
          'idx': this.user_session.idx,
          'email' : this.registration_form.email,
          'gender': this.registration_form.gender,
          'age': this.registration_form.age
      }
      this.userService.query( data, response =>{
          console.log('post ' + JSON.stringify(response));
          
      }, err =>alert('Something went wrong ' + err ) )
    }

    register(){
        if( this.validate() == false) return;
        this.userService.user_register( this.registration_form, res=>{
            console.log('successfull registered ' + res );
            this.router.navigate(['/home'])
        }, err=> alert('error ' + err ))
    }



    validate(){
        if( this.registration_form.email == '' || this.registration_form.email == null){
            alert('enter email');
            return false;
        }
        if( this.registration_form.password == '' || this.registration_form.password == null ){
            alert('no password');
            return false;
        }
        if( this.registration_form.id == '' || this.registration_form.id == null ){
            alert('no uid');
            return false;
        }
        return true;
    }
}