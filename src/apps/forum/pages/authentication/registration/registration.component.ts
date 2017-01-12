import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Data } from '../../../services/data';
import { Router } from '@angular/router';

interface form{
    firstname:string,
    lastname: string,
    email:string,
    gender: string,
    age,
    birthdate: string
}
@Component( {
    selector: 'registration-page',
    templateUrl: 'registration.component.html'
})
export class RegistrationPage implements OnInit {
    disablebutton:boolean = false;
    position;
    password;
    public defaultPhoto:string = 'https://firebasestorage.googleapis.com/v0/b/aonicfirebase.appspot.com/o/photo%2F1484126507162%2Fdefault.jpg?alt=media';
    file_progress;
    urlPhoto:string;
    button_title;
    user_session;
    userdata
    registration_form:form = <form>{};

    constructor( public userService: UserService, public router: Router, private data: Data, private ngZone: NgZone ){

        this.urlPhoto = this.defaultPhoto;
        this.checklogin();
        this.getUserData();




        if( this.user_session )  this.button_title = 'update';
        else this.button_title = 'register';
    }

  /**
   *
   * @description getting userdata if someone is logged in.
   *
   */
    getUserData(){
          if( this.user_session ){
              this.userService.get( this.user_session , res =>{
                  console.log('getUserData() ' + res['email'] )
                  this.userdata = res;
                  this.renderPage();
              }, error => alert('Something went wrong ' + error ) )
          }
      }
    renderPage(){
            this.ngZone.run(() =>{
                console.log('ngzone(())')
                this.initialize();
            })
    }

  /**
   * @description this will check if there's someone logged in
   */
    checklogin(){
          this.userService.checklogin( res =>{
              this.user_session = res;
              console.info('checklogin ' + res )
          }, ()=>console.log('not logged in'))
      }

  /**
   *
   * @description this will upload users profile picture to firebse storage.
   * @description user can choose profile pic on registration or edit/change it later.
   *
   */
  onChangeFile( $event ){
        let file = $event.target.files[0];
        console.log("Console:file: ",file);
        if( file == void 0) return;
        this.file_progress = true;

        let ref = 'photo/' + Date.now() + '/' + file.name;
        console.log( 'file ' ,  file  )


        this.data.upload( { file: file, ref: ref }, uploaded=>{
            console.log('url ' + uploaded.url)
            this.renderProfilePic( uploaded.url )

        }, error=>{
            alert('Error'+ error);
        },
        percent=>{
          this.position = percent;
            this.renderProgress( percent );
        } );
    }

    renderProfilePic( data ){
      this.ngZone.run(() =>{
        this.urlPhoto = data;
        this.disablebutton = false;
        this.file_progress = false;
      })
    }
    renderProgress( percent ) {
      this.ngZone.run(() => {
          this.disablebutton = true;
        this.position = percent;
      });
    }

    ngOnInit(){


    }

  /**
   * @description initializing user's data if there's someone logged in.
   */
  initialize(){
        if( this.userdata ){
            console.log('fname ' + this.userdata['firstname'])
                console.info('userData '  + JSON.stringify(this.user_session))
                this.urlPhoto  = this.userdata.photo;
                this.registration_form.firstname = this.userdata['firstname'];
                this.registration_form.lastname = this.userdata['lastname'];
                this.registration_form.age = this.userdata['age'];
                this.registration_form.email = this.userdata['email'];
                this.registration_form.gender = this.userdata['gender'];

        }
    }

    onClickRegister(){
        if(! this.user_session ){
            this.register();
            return;
        }
        this.update();

    }


  /**
   * @description this method is used to update user's meta data/ informations
   */
  update(){
        let data = {
            firstname : this.registration_form.firstname,
            lastname : this.registration_form.lastname,
            age : this.registration_form.age,
            gender : this.registration_form.gender,
            photo : this.urlPhoto
        }
      this.userService.update( data, success =>{
          console.log('successCallback() ' + success )
      }, error => alert('error ' + error ) )
    }

  /**
   * this method will register an account and will create a meta data for the user
   * before running the whole method it'll run the validate() method first and check if the user answered all the required fields.
   * @description if the user didn't passed the validation it'll return and will not proceed.
   */
  register(){
      if( this.validate() == false ) return;
            let data ={
                firstname : this.registration_form.firstname,
                lastname : this.registration_form.lastname,
                email : this.registration_form.email,
                age : this.registration_form.age,
                gender : this.registration_form.gender,
                photo : this.urlPhoto
            }
        try{
            this.userService.register( this.registration_form.email, this.password,
            res =>{
                setTimeout( () =>{
                    console.log('registration response : ' + res['uid']);
                    this.userService.create_user_metadata( data , response =>{
                        console.log('metadata ' + response )
                    }, error =>console.log('error ' + error ) )
                }, 200);
                this.router.navigate(['home']);
            }, err =>alert( 'Something went wrong ' + err ) )
        }
        catch( e ){
            console.log('error handled ' + e)
        }

    }



  /**
   * @description this method will validate form if the user filled/answered all the required field.
   * @returns {boolean}  false if any of the conditions didn't pass.
   * @returns {boolean} true if all the conditions are passed.
   * @description this also shows alert if the condition didn't pass.
   */



    validate(){
        if( this.registration_form.email == '' || this.registration_form.email == null){
            alert('enter your Email address');
            return false;
        }
        if( this.password == '' || this.password == null ){
            alert('password is required');
            return false;
        }
        if( this.registration_form.firstname == '' || this.registration_form.firstname == null ){
            alert('please provide your firstname');
            return false;
        }
        if( this.registration_form.lastname == '' || this.registration_form.lastname == null ){
            alert('please provide your Lastname');
            return false;
        }
        if( this.registration_form.gender == '' || this.registration_form.gender == null){
          alert('Please select your gender');
          return false;
        }
        return true;
    }
}
