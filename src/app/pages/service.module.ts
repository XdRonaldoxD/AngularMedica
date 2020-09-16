
import { NgModule } from '@angular/core';

import {SeetingService,SharedService,SidebarService,VerificaTokenGuard} from '../services/service.index';
import { CommonModule } from '@angular/common';
// import { VerificaTokenGuard } from '../services/token/verifica-token.guard';




@NgModule({

  imports: [
    CommonModule,
    // VerificaTokenGuard
  ],
  providers :[
    SeetingService,
    SidebarService,
    SharedService,
    VerificaTokenGuard
  ]

})
export class ServiceModulo { }
