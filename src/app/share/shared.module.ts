import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { NopagefoundComponent } from "./nopagefound/nopagefound.component";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { BreadcumsComponent } from "./breadcums/breadcums.component";
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';




@NgModule({
  imports:[
    RouterModule,
    CommonModule,
    PipesModule
  ],
  declarations: [
    NopagefoundComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcumsComponent,
  ],
  exports: [
    NopagefoundComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcumsComponent,
  ],
})
export class SharedModule {}
