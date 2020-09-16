import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../services/Usuario/user.service";
import { Router } from '@angular/router';
import { User } from "../../models/user";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { error } from "protractor";
import Swal from 'sweetalert2';


@Component({
  selector: "app-accout-setting",
  templateUrl: "./accout-setting.component.html",
  styleUrls: ["./accout-setting.component.css"],
})
export class AccoutSettingComponent implements OnDestroy, OnInit {
  submitted = false;
  dnivalido = false;
  dniExistente=false;
  //Datatable
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  public user: User;
  modalRef: BsModalRef;

  //Identificacion del usuario
  identity: any;
  token: any;
  //Recibe datos a la data
  data: any;
  cargando=false;
  constructor(
    private Http: HttpClient,
    public _userServicie: UserService,
    private _route: Router,
    private modalService: BsModalService,

  ) {
    this.token = this._userServicie.getToken();
    this.identity = this._userServicie.getIdentity();
    this.user = new User(1, "", "", "", "", "ROLE_DOCTOR", "", "", "", "", "","");
  }

  ngOnInit() {
    if (!this.identity) {
      this._route.navigate(["/login"]);
    }
        // this.cargando=false;
    this.listarDoctores();

  }

  listarDoctores() {
    this.cargando=true;
    this._userServicie.listarUsuario(this.token).subscribe((respuesta) => {
      this.data = respuesta;
      this.dtTrigger.next();
  
    });
    //Funcion del Datatable
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
      ordering:false,
      responsive:true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    this.cargando=false;
   
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

 

  EnviandoDoctor(Dato) {
    if (
      this.user.nombre != "" &&
      this.user.apellido != "" &&
      this.user.dni != "" &&
      this.user.email != "" &&
      this.user.password != "" &&
      this.dnivalido==false && 
      this.dniExistente ==false
    ) {
      console.log(this.user);
      this._userServicie
        .registerDoctor(this.token, this.user)
        .subscribe((resp) => {
          //Vacia el formulario
          Dato.reset();
          console.log(resp);
          //Primero destruimos la tablas y lo vuelve a generar(listarDoctores)
          this.dtElement.dtInstance.then((dtInstancia:DataTables.Api)=>{
            dtInstancia.destroy();
            this.listarDoctores();
            this.modalRef.hide();
            Swal.fire({
              toast:true,
              position: 'top-end',
              icon: 'success',
              title: 'Doctor registrado Correctamente',
              showConfirmButton: false,
              timer: 2000
            })
          });
        });
    } else {
      console.log("No hya datos");
    }
  }


  //EDITAR DOCTOR
  EditarDoctores(Dato) {
    if (
      this.user.nombre != "" &&
      this.user.apellido != "" &&
      this.user.email != "" &&
      this.dnivalido==false && 
      this.dniExistente ==false &&
      this.user.id_doctor !=""
    ) {
      console.log(this.user);
      this._userServicie
        .EditarDoctor(this.token, this.user)
        .subscribe((resp) => {
          //Vacia el formulario
          Dato.reset();
          console.log(resp);
          //Primero destruimos la tablas y lo vuelve a generar(listarDoctores)
          this.dtElement.dtInstance.then((dtInstancia:DataTables.Api)=>{
            dtInstancia.destroy();
            this.listarDoctores();
            this.modalRef.hide();
            Swal.fire({
              toast:true,
              position: 'top-end',
              icon: 'success',
              title: 'Se registro el Doctor Correctamente',
              showConfirmButton: false,
              timer: 2000
            })
          });
        });
    } else {
      console.log("No hay datos");
    }
  }

  //Limpiando Data usuario(Doctor)
limpiar(){
  this.user.apellido="";
  this.user.celular="";
  this.user.direccion="";
  this.user.dni="";
  this.user.nombre="";
  this.user.email="";
  this.user.id_doctor="";
}
  //habrir el modal
  openModal(template: TemplateRef<any>) {
    //Modal Estatico
    this.limpiar();
    this.modalRef = this.modalService.show(template, { class: "modal-lg" , backdrop : "static" });
  }
  openModalEdit(Edittemplate: TemplateRef<any>,id) {
    //Modal Estatico
    this.submitted=false;
    this.limpiar();
    this._userServicie.TraerDatosDoctor(this.token,id).subscribe(
      respu=>{
        console.log(respu);
        this.user.apellido=respu.apellido;
        this.user.celular=respu.celular;
        this.user.direccion=respu.direccion;
        this.user.dni=respu.dni;
        this.user.nombre=respu.nombre;
        this.user.email=respu.email;
        this.user.id_doctor=respu.id;
      }
    )
    this.modalRef = this.modalService.show(Edittemplate, { class: "modal-lg" , backdrop : "static" });
  }
  //Para cerrar el modal
  EnviandoDoctorPrueba() {
    this.modalRef.hide();
  }

  //ValidarDNI
  ValidarDNI(NUMERODNI) {
    this._userServicie.ValidarDNI(NUMERODNI).subscribe(
      (respo) => {
        console.log(respo);
        if (respo) {
          this.dnivalido = false;
          this._userServicie
            .DniExistente(this.token, NUMERODNI)
            .subscribe((respu) => {
              if (respu == true) {
                this.dniExistente = true;

              } else {
                this.dniExistente = false;
                this.user.nombre = respo.nombres;
                this.user.apellido =
                  respo.apellidoPaterno + " " + respo.apellidoMaterno;
              
              }
            });
        }
      },
      (error) => {
        if (error) {
          this.dnivalido = true;
          this.dniExistente = false;
        }
      }
    );
  }
  //CorreoElectronico
  ValidarCorreo(email) {
    this._userServicie.emailValido(this.token, email).subscribe((respu) => {
      if (respu == true) {
        this.submitted = true;
      } else {
        this.submitted = false;
      }
    });
  }

  EliminarDoctor(id,nombre){
    Swal.fire({
      title: '¿Esta seguro de deshabilitar al doctor '+nombre+'?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.value) {
        this._userServicie.DeshabilitarDoctor(this.token,id).subscribe(
          respu=>{
            console.log(respu);
          }
        )
        this.dtElement.dtInstance.then((dtInstancia:DataTables.Api)=>{
          dtInstancia.destroy();
          this.listarDoctores();
        })
        Swal.fire(
          'Deshabilitado!',
          'Doctor deshabilitado.',
          'success'
        )
      }
    })
  }




}
