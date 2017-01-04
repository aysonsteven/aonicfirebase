import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component( {
    selector: 'base-nav',
    templateUrl: './base-nav.html'
})
export class BaseNav {

    userdata;
    constructor( private userService: UserService){
        this.getlogindata();
    }

    onClickLogout(){

    }

    getlogindata(){

    }
}