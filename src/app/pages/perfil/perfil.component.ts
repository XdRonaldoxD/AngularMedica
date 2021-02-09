import { Component, OnInit } from "@angular/core";
import { Perfil } from "src/app/models/perfil";
import { UserService } from "../../services/Usuario/user.service";
import Swal from "sweetalert2";
import { read } from "fs";
import { PerfiluserService } from "../../services/perfil/perfiluser.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.component.html",
  styleUrls: ["./perfil.component.css"],
})
export class PerfilComponent implements OnInit {
  imagenSubir: File = null;
  token: any;
  identity: any;
  perfil: Perfil;
  imgTemporal: string;
  validado: boolean = false;
  constructor(
    public _userServicie: UserService,
    public _perfilServicie: PerfiluserService
  ) {}

  ngOnInit() {
    this.token = this._userServicie.getToken();
    this.identity = this._userServicie.getIdentity();
    this.perfil = new Perfil(
      this.identity.sub,
      this.identity.nombre,
      this.identity.apellido,
      this.identity.email,
      null
    );
  }

  EnviarPerfil(Datos) {
    if (Datos.valid) {
      this._perfilServicie
        .EditarPerfil(this.token, this.perfil)
        .subscribe((respuesta) => {
          if ((respuesta.code = 200)) {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Datos Actualizado correctamente.",
              showConfirmButton: false,
              timer: 2000,
            });
            console.log(respuesta);
            this._userServicie.actualizarIdentity(respuesta.data);
          } else {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "error",
              title: "Ubo un error al enviar los datos.",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
    } else {
      this.validado = true;
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Debe llenar los datos requerido.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
  FotografiaPerfil() {
    if (this.imagenSubir != null) {
      this._perfilServicie
        .EditarFotografiaPerfil(this.token, this.identity.sub, this.imagenSubir)
        .subscribe((respuesta) => {
          if ((respuesta.code = 200)) {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Datos Actualizado correctamente.",
              showConfirmButton: false,
              timer: 2000,
            });
            console.log(respuesta);
            this._userServicie.actualizarIdentity(respuesta.data);
          }
        });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Debe seleccionar una imagén.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
  seleccioneImagen(imagen: File) {
    if (imagen.type.indexOf("image") < 0) {
      Swal.fire(
        "Sólo imágenes",
        "El Archivo seleccionado no es una imagen",
        "error"
      );
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = imagen;

    let reader = new FileReader();
    let urlImagentemp = reader.readAsDataURL(imagen);
    reader.onloadend = () => (this.imgTemporal = reader.result as string);
  }
}
