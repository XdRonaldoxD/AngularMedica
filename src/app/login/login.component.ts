import { Component, OnInit, TemplateRef } from '@angular/core';
import {  Router, ActivatedRoute ,Params} from '@angular/router';
import { UserService } from '../services/Usuario/user.service';
import { User } from '../models/user';
import Swal from "sweetalert2";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent implements OnInit {
 
  modalRef: BsModalRef;
  template:any;
   user: User;
   status:string;
   token:any;
   identity:any;
  
  constructor(
    private _userServicio:UserService,
    private modalService: BsModalService,
    public router:Router) { 
    this.user = new User(1, "", "", "", "", "ROLE_USER", "","","","","","");
  }
  ngOnInit() {
  
  }
  Ingresar(form,template: TemplateRef<any>){
    this._userServicio.login(this.user).subscribe(
      response => {
        //Token

        if (response.status != 'error' ) {
          this.status='Succes';
          this.token=response;
          //objeto usuario Identificado
          this._userServicio.login(this.user,true).subscribe(
            response => {
              this.identity=response;
              // DATOS USUARIO IDENTIFICADO
              localStorage.setItem('token',this.token);
              localStorage.setItem('UserIdentificado',JSON.stringify(this.identity))
              this.router.navigate(['/dashboard']);
              Swal.fire({
                toast:true,
                position: 'top-end',
                icon: 'success',
                title: 'Bienvenido',
                showConfirmButton: false,
                timer: 2000
              })
            },
            error =>{
              console.log(<any>error);
            }
          );
        }else{
          if (!isNaN(response.id_usuario)) {
            this.user.id=response.id_usuario;
            this.modalRef = this.modalService.show(template, { class: "modal-lg" , backdrop : "static" });
          } else {
            this.status="Error";
            console.log(this.status);
            Swal.fire({
              toast:true,
              position: 'top-end',
              icon: 'error',
              title: 'Usuario Incorrecto',
              showConfirmButton: false,
              timer: 2000
            })
          }
  
        }
      },
      error =>{
        this.status='Error';
        console.log(<any>error);
      }
    );
  }
  CerrandoSession(){
    console.log(this.user.id);
    this._userServicio.cerrarSession(this.user.id)
    .subscribe(respo=>{
      // console.log(respo);
      this.modalRef.hide();
    })
  }
}
