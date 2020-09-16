import { Component, OnInit } from '@angular/core';
import {  Router, ActivatedRoute ,Params} from '@angular/router';
import { UserService } from '../services/Usuario/user.service';
import { User } from '../models/user';
import Swal from "sweetalert2";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent implements OnInit {
 
   user: User;
   status:string;
   token:any;
   identity:any;
  
  constructor(
    private _userServicio:UserService,
    public router:Router) { 
    this.user = new User(1, "", "", "", "", "ROLE_USER", "","","","","","");
  }
  ngOnInit() {
  
  }
  Ingresar(form){
    this._userServicio.login(this.user).subscribe(
      response => {

        //Token
        if (response.status != 'error') {
          this.status='Succes';
          this.token=response;
          //objeto usuario Identificado
          this._userServicio.login(this.user,true).subscribe(
            response => {
              this.identity=response;
              // console.log(this.token);
              // console.log(this.identity);
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
      },
      error =>{
        this.status='Error';
        console.log(<any>error);
      }
    );
  }
}
