import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { Test } from './test';

@Injectable()

export class UserTest{

    constructor( private user: UserService ) {
        console.log('UserTest::constructor() user: ', user);
    }
}