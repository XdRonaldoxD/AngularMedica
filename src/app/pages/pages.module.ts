import { NgModule ,NO_ERRORS_SCHEMA  } from "@angular/core";
import { FormsModule } from "@angular/forms";
//MODULO SHARED
import { SharedModule } from '../share/shared.module';


import { RegistrarpacienteComponent } from './registrarpaciente/registrarpaciente.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';


import { IncrementadorComponent } from '../componente/incrementador.component';



//ng2 char
import { ChartsModule } from 'ng2-charts';
import { GraficaDonaComponent } from '../grafica/grafica-dona.component';
import { AccoutSettingComponent } from './accout-setting/accout-setting.component';
import { DxButtonModule, DxDateBoxModule } from 'devextreme-angular';
import { DatePipe } from '@angular/common';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
//Para guardar imagenes
import { AngularFileUploaderModule } from "angular-file-uploader";
//Servicios
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from "@angular/http";
import { DataTablesModule } from 'angular-datatables';  
import { BrowserModule } from '@angular/platform-browser';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HistoriaPacienteComponent } from './historia-paciente/historia-paciente.component';

import { QuillComponent } from './quill/quill.component';
import { CKEditorModule } from 'ng2-ckeditor';





@NgModule({

    declarations:[
     DashboardComponent,
    ProgressComponent,
    RegistrarpacienteComponent,
    Graficas1Component,
    PagesComponent,
    IncrementadorComponent,
    GraficaDonaComponent,
    AccoutSettingComponent,
    HistoriaPacienteComponent,
    QuillComponent
    ],
    exports:[
        //ESTAS PAGINAS SERAN USADAS POR OTRO CONPONENTE FUERA DE ESTE MODULO
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ],
    imports:[
        CKEditorModule,
        BrowserModule,
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ChartsModule,
        DxButtonModule,
        DxDateBoxModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        AngularFileUploaderModule,
        DataTablesModule ,
 
        HttpClientModule,
        HttpModule,

        ModalModule.forRoot(),
        TooltipModule.forRoot()
    ],
    providers:[DatePipe],
    schemas: [ NO_ERRORS_SCHEMA ]

})
export class PagesModule { }