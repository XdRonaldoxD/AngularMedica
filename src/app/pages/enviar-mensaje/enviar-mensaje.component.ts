import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InformacionMensaje } from "src/app/models/InformacionMensaje";
import { Mensaje } from "src/app/models/mensaje";
import { EnviarMensajePaciente } from "src/app/services/enviarMensaje/EnviarMensaje.service";
import { UserService } from "../../services/Usuario/user.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-enviar-mensaje",
  templateUrl: "./enviar-mensaje.component.html",
  styleUrls: ["./enviar-mensaje.component.css"],
})
export class EnviarMensajeComponent implements OnInit {
  name = "ng2-ckeditor";
  public ckeConfig = {
    toolbar: [
      ["Source"],
      ["Styles", "Format", "Font", "FontSize"],
      ["Bold", "Italic"],
      ["Undo", "Redo"],
    ],
  };
  public Mensaje: Mensaje;
  public Informacion: InformacionMensaje;
  token: any;
  id_paciente: any;
  validar: boolean = false;
  documentoExtension: any;

  constructor(
    private _activateRoute: ActivatedRoute,
    public _enviarMensaje: EnviarMensajePaciente,
    public _userservico: UserService,
    public router: Router
  ) {
    this.Mensaje = new Mensaje("", null, "", "");
    this.Informacion = new InformacionMensaje(
      "",
      "",
      "",
      "",
      "",
      null,
      "",
      "",
      "",
      "",
      "",
      ""
    );
  }

  ngOnInit() {
    this.token = this._userservico.getToken();
    this.MostrandoPaciente();
  }

  MostrandoPaciente() {
    this._activateRoute.params.subscribe((params) => {
      this.id_paciente = +params["id_Paciente"];
      if (!isNaN(this.id_paciente)) {
        this._enviarMensaje
          .TraerDatoPaciente(this.token, this.id_paciente)
          .subscribe((datos) => {
            if (datos != "error") {
              this.Mensaje.NumeroTelefono = datos.whatsapp;
              this.Informacion.Nombres = datos.nombre;
              this.Informacion.Apellidos = datos.apellido;
              this.Informacion.Edad = datos.edad;
              this.Informacion.Sexo = datos.sexo;
              this.Informacion.FechaNacimiento = datos.fecha_nacimiento;
              this.Informacion.Dni = datos.dni;
              this.Informacion.Temperatura = datos.t;
              this.Informacion.Peso = datos.peso;
              this.Informacion.Talla = datos.talla;
              this.Informacion.FrecuenciaRespi = datos.fr;
              this.Informacion.FrecuenciaCardi = datos.fc;
            } else {
              this.router.navigate(["/dashboard"]);
            }
          });
      }
    });
  }

  EnviandoMensaje(Datos) {
    console.log(Datos);
    if (Datos.valid) {
      this.validar = false;
      this._enviarMensaje
        .EnviarMensaje(this.token, this.Mensaje)
        .subscribe((res) => {
          this.Mensaje.Mensaje='';
          this.Mensaje.tipoMensaje='';
          this.Mensaje.Archivo="";
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Se Envio correctamente el Mensaje.",
            showConfirmButton: false,
            timer: 4000,
          });
        });
    } else {
      this.validar = true;
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Los Campos deben estar llenos.",
        showConfirmButton: false,
        timer: 4000,
      });
    }
  }
  CapturaTipo(tipo) {
    this.Mensaje.tipoMensaje = tipo;
    let Archivo_mensaje = document.querySelector("#Archivo_mensaje");
    let texto_url = document.querySelector(".texto_url");
    let archivo = document.querySelector("#Archivo");
    switch (tipo) {
      case "2":
        Archivo_mensaje.classList.remove("d-none");
        archivo.setAttribute("required", "true");
        texto_url.innerHTML = "Subir URL de Imagen";
        break;
      case "3":
        Archivo_mensaje.classList.remove("d-none");
        archivo.setAttribute("required", "true");
        texto_url.innerHTML = "Subir URL de Archivo";
        break;

      default:
        Archivo_mensaje.classList.add("d-none");
        archivo.removeAttribute("required");
        break;
    }
  }

  // getFiles(event) {
  //   this.Mensaje.Archivo = event.target.files[0];
  //   this.documentoExtension = this.Mensaje.Archivo.name.split('.').pop();
  //   this.fileName = this.Mensaje.Archivo.name;
  //   console.log(this.fileName);
  // }
}
