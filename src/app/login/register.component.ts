import { Component, OnInit } from "@angular/core";

import { User } from "../models/user";
import { UserService } from '../services/Usuario/user.service';


@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styles: [],
  providers:[UserService]
})
export class RegisterComponent implements OnInit {

  submitted = false;
  

  public passwordRepetea: any;
  public user: User;
  constructor(
    private _userServicio:UserService
  ) {
    this.user = new User(1, "", "", "", "", "ROLE_USER", "","","","","","");

  }

  ngOnInit() {

  }

  EnviandoForm(DatosUser) {
  
    // DatosUser.reset();->limpiar
    if (DatosUser.valid) {
      let pwd:any= document.querySelector('#password');
      if (this.user.password != this.user.passwordrepetido) {
        this.submitted = true;
        pwd.style.border="1px solid red";
        
   
        console.log("No son iguales");
        return;
      }else{
        pwd.style.border="1px solid green";
        console.log("son iguales");
        this._userServicio.register(this.user).subscribe(
          response => {
            console.log(response);
          },
          error =>{
            console.log(<any>error);
          }
        );
      }
    } else {
      this.submitted = true;
      console.log("No validado");
      return;
    }
    
  }


}
