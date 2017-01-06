import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Data } from '../../../services/data';
import { Router } from '@angular/router';

interface form{
    firstname:string,
    lastname: string,
    email:string,
    gender: string,
    age: number,
    birthdate: string
}
@Component( {
    selector: 'registration-page',
    templateUrl: 'registration.component.html'
})
export class RegistrationPage implements OnInit {
    password;
    public defaultPhoto:string = 'https://firebasestorage.googleapis.com/v0/b/aonicfirebase.appspot.com/o/photo%2F1483683351860%2Fdefault.jpg?alt=media';
    file_progress;
    urlPhoto:string
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
    checklogin(){
        this.userService.checklogin( res =>{
            this.user_session = res;
            console.info('checklogin ' + res )
        }, ()=>console.log('not logged in'))
    }

    onChangeFile( $event ){
        let file = $event.target.files[0];
        console.log("Console:file: ",file);
        if( file == void 0) return;
        this.file_progress = true;

        let ref = 'photo/' + Date.now() + '/' + file.name;
        console.log( 'file ' ,  file  )


        this.data.upload( { file: file, ref: ref }, uploaded=>{
            console.log('url ' + uploaded.url)  
            this.urlPhoto = uploaded.url;
      
        }, error=>{
            alert('Error'+ error);
        },
        percent=>{    
            // this.renderPage();    
            // this.position = percent;     
        } );
    }


    ngOnInit(){
        
        
    }


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

    register(){
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
                    this.userService.create( data , response =>{
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





    validate(){
        if( this.registration_form.email == '' || this.registration_form.email == null){
            alert('enter email');
            return false;
        }
        if( this.password == '' || this.password == null ){
            alert('no password');
            return false;
        }
        if( this.registration_form.firstname == '' || this.registration_form.firstname == null ){
            alert('no firstname');
            return false;
        }
        if( this.registration_form.lastname == '' || this.registration_form.lastname == null ){
            alert('no lastname');
            return false;
        }
        return true;
    }
}