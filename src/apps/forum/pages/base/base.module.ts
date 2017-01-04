import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { BaseNav } from './base-nav/base-nav';


@NgModule({
  declarations: [
      BaseNav
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule

  ],

  providers: [ ],
  exports: [ BaseNav]
})
export class BaseModule {}


