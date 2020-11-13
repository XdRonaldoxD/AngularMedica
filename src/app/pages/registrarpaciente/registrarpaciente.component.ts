import {
  Component,
  OnInit,
  TemplateRef,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { Paciente } from "../../models/paciente";
import { UserService } from "../../services/Usuario/user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HistoriapacienteService } from "../../services/paciente/historiapaciente.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { Indicaciones } from "src/app/models/indicaciones";
import { IndicacionesMedicas } from '../../services/indicaciones/indicaciones.service';
import { ViewChild } from '@angular/core';
import { empty } from 'rxjs';

@Component({
  selector: "app-registrarpaciente",
  templateUrl: "./registrarpaciente.component.html",
  styles: [],
})
export class RegistrarpacienteComponent implements OnInit, AfterViewInit {

  name = 'ng2-ckeditor';
  indicacionDoctor:string;
public ckeConfig = {
		toolbar: [
			[ 'Source' ],
			[ 'Styles', 'Format', 'Font', 'FontSize' ],
			[ 'Bold', 'Italic' ],
			[ 'Undo', 'Redo' ]
		]
	}


  submitted = false;
  dnivalido = false;
  dniExistente = false;
  validar = false;
  opcionesIndicaciones=false;
  selectGenero = false;
  documentoPaciente=false;
  CapturaGenero(genero) {
    if (genero == "Masculino" || genero == "Femenino") {
      this.selectGenero = true;
    }
  }
  mostrarTratamiento = false;
  now: Date = new Date();
  nuevaCita: Date = new Date();
  fecha: any = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm");
  fechaActual: any = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  proximaCita: any = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm");

  identity: any;
  token: any;
  recibirindicaciones: any;
  modalRef: BsModalRef;
  ReportePdf = "http://127.0.0.1:8000/api/Indicaciones/Doctor/Exportar/";
  public url: any = "http://127.0.0.1:8000/api/login/";
  public imagen = false;
  public paciente: Paciente;
  public indicacion: Indicaciones;
  public diagnosticado: any;
  public id_indicaciones;

  resetVar: false;
  constructor(
    private datePipe: DatePipe,
    public _userservico: UserService,
    private _route: Router,
    public _HistoriaPaciente: HistoriapacienteService,
    public _IndicacionesMedicas: IndicacionesMedicas,
    private modalService: BsModalService,
    private elementRef: ElementRef,
    private _activateRoute: ActivatedRoute
  ) {
    this.paciente = new Paciente(
      null,
      null,
      "",
      "",
      "",
      "",
      "",
      "",
      this.fecha,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      this.fechaActual,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      [],
      "",
      this.proximaCita,
      ""
    );
    this.indicacion = new Indicaciones(null, "", null, "", null, "", null);
    this.token = this._userservico.getToken();
    this.identity = this._userservico.getIdentity();
  }

  ngOnInit() {
    if (!this.identity) {
      this._route.navigate(["/login"]);
    }
    localStorage.removeItem("Diagnostico");
    this.mostraandoDiagnostico();
    this.RenovandoPaciente();
    this.documentoPaciente=true;
  }

  //Para subir la imagen del API
  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI: {
      url: "http://127.0.0.1:8000/api/login/Paciente/perfil/update",
      method: "POST",
      headers: {
        Authorization: this._userservico.getToken(),
      },
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: true,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: "Select Files",
      resetBtn: "Reset",
      uploadBtn: "Upload",
      dragNDropBox: "Drag N Drop",
      attachPinBtn: "Sube la imagen del Paciente",
      afterUploadMsg_success: "Successfully Uploaded !",
      afterUploadMsg_error: "Upload Failed !",
      sizeLimit: "Size Limit",
    },
  };
  ImagenPacienteSubido(datos) {
    this.paciente.Imagen = datos.body.imagen;
  }
  //Para subir la imagen del API
  DocumentoLaboratioPdf = {
    multiple: false,
    formatsAllowed: ".pdf",
    maxSize: "50",
    uploadAPI: {
      url: "http://127.0.0.1:8000/api/login/Paciente/pdf/update",
      method: "POST",
      headers: {
        Authorization: this._userservico.getToken(),
      },
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: true,
    fileNameIndex: true,
    replaceTexts: {
      selectFileBtn: "Select Files",
      resetBtn: "Reset",
      uploadBtn: "Upload",
      dragNDropBox: "Drag N Drop",
      attachPinBtn: "Sube el documento del Paciente",
      afterUploadMsg_success: "Successfully Uploaded !",
      afterUploadMsg_error: "Upload Failed !",
      sizeLimit: "Size Limit",
    },
  };
  PdfPacienteSubido(datos) {
    this.paciente.documentoLabotario = datos.body.pdf;
  }

  ValidarDNI(NUMERODNI) {
    this._userservico.ValidarDNI(NUMERODNI).subscribe(
      (respo) => {
        console.log(respo);
        if (respo) {
          this.dnivalido = false;
          this._HistoriaPaciente
            .DniExistentePaciente(this.token, NUMERODNI)
            .subscribe((respu) => {
              if (respu == true) {
                this.dniExistente = true;
              } else {
                this.dniExistente = false;
                this.paciente.NombrePaciente = respo.nombres;
                this.paciente.ApellidoPaciente =
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

  EnviandoPaciente(Dato) {
    console.log(Dato);
    var paciente = this.paciente;
    if (
      paciente.NumeroCitaMedica == "" ||
      paciente.NombrePaciente == "" ||
      paciente.ApellidoPaciente == "" ||
      paciente.SexoPaciente == "" ||
      paciente.Dni == "" ||
      paciente.Edad == "" ||
      this.dnivalido ||
      this.dniExistente
    ) {
      this.validar = true;
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Debe almacenar los campos correctamente",
        showConfirmButton: false,
        timer: 3000,
      });
      // console.log("aca");
    } else {
      let datos = JSON.parse(localStorage.getItem("Diagnostico"));
        this.paciente.diagnostico = datos;
      this.paciente.id_user = this.identity.sub;
      this.paciente.proximacita= this.datePipe.transform(this.proximaCita, "yyyy-MM-dd HH:mm");
      this.paciente.FechaNaciemto=this.datePipe.transform(this.fecha,"yyyy-MM-dd HH:mm");
      localStorage.removeItem("Diagnostico");
      this._HistoriaPaciente
        .InsertarPaciente(this.token, this.paciente)
        .subscribe((datos) => {
          console.log(datos);
          this._route.navigate(["/HistoriaMedica/1"]);
        });
    }
  }

  //Usando Localstorage
  Diagnostico(dato) {
    console.log(dato);
    if(dato.length>1){
      this.diagnosticado='';
      let Diag = this.traerDiagnostico();
      Diag.push(dato);
      localStorage.setItem("Diagnostico", JSON.stringify(Diag));
  
      const lista = document.querySelector("#diagnos-list");
      lista.innerHTML = "";
      this.mostraandoDiagnostico();
    }else{
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Debe Escribir el diagnostico.",
        showConfirmButton: false,
        timer: 3000,
      });
    };
   
 
  }
  traerDiagnostico() {
    let Diag;
    if (localStorage.getItem("Diagnostico") === null) {
      Diag = [];
    } else {
      Diag = JSON.parse(localStorage.getItem("Diagnostico"));
    }
    return Diag;
  }
  mostraandoDiagnostico() {
    let diag = this.traerDiagnostico();
    diag.forEach((dignostico) => {
      const lista = document.querySelector("#diagnos-list");
      const fila = document.createElement("tr");
      fila.innerHTML = `
    <td>${dignostico}</td>
    <td><button type="button"   class="btn btn-danger delete">x</button></td>`;
      lista.append(fila);
    });
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement
      .querySelector("#diagnos-list")
      .addEventListener("click", this.onClick.bind(this));
  }
  onClick(event) {
    let button = event.target;
    if (button.classList.contains("delete")) {
      //Agarra el elemento padre que es el td y del elemento padre del td
      //es el tr
      button.parentElement.parentElement.remove();
      this.removerLocalStorage(
        button.parentElement.previousElementSibling.textContent
      );
    }
  }

  removerLocalStorage(diagnostico) {
    console.log(diagnostico);
    const diag = this.traerDiagnostico();
    diag.forEach((element, index) => {
      if (element === diagnostico) {
        diag.splice(index, 1);
      }
    });
    localStorage.setItem("Diagnostico", JSON.stringify(diag));
  }

  renovarDatoPaciente(id_paciente){
    Swal.fire({
      title: '¿Esta seguro de renovar los datos del Paciente ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        this._HistoriaPaciente.EliminarTratamientoPaciente(this.token,id_paciente)
        .subscribe(respuesta=>{
          console.log(respuesta);
        });
    this.paciente.MotivoConsulta="";
    this.paciente.GP="";
    this.paciente.FUR="";
    this.paciente.PAP="";
    this.paciente.MAC="";
    this.paciente.RAM="";
    this.paciente.AntecendesPersonales="";
    this.paciente.AntecendesFamiliares="";
    this.paciente.PA="";
    this.paciente.T="";
    this.paciente.FC="";
    this.paciente.FR="";
    this.paciente.Peso="";
    this.paciente.Talla="";
    this.paciente.ComentarioExamenClinico="";
    this.paciente.imageneologia="";
    localStorage.removeItem("Diagnostico");
    const lista = document.querySelector("#diagnos-list");
    lista.innerHTML = ``;
        Swal.fire(
          'Renovado!',
          'Datos Limpiado.',
          'success'
        )
      }
    })

  }

  openModal(template: TemplateRef<any>) {
    //Modal Estatico
    // this.limpiar();
    this.modalRef = this.modalService.show(template, {
      class: "modal-lg",
      backdrop: "static",
    });
  }

  // Saber si se renovara o editar el paciente
  RenovandoPaciente() {
    this._activateRoute.params.subscribe((params) => {
      this.id_indicaciones = +params["id_Paciente"];

      this.indicacion.hclinip = String(this.id_indicaciones);
      this.indicacion.usuario_id = this.identity.sub;
      if (!isNaN(this.id_indicaciones)) {
        //Muestra Indicaciones
        this.selectGenero = true;
        this.mostrarTratamiento = true;
        this.MostrarIndicaciones(this.id_indicaciones);
        this._HistoriaPaciente
          .TraerDatoPaciente(this.token, this.id_indicaciones)
          .subscribe((datos) => {
            console.log(datos);
            this.paciente.id_paciente = this.id_indicaciones;
            this.paciente.NumeroCitaMedica = datos.nCitamed;
            if (datos.img_perfil != null) {
              this.paciente.Imagen = datos.img_perfil;
              this.imagen = true;
            }
            this.paciente.NombrePaciente = datos.nombre;
            this.paciente.ApellidoPaciente = datos.apellido;
            this.paciente.SexoPaciente = datos.sexo;
            this.paciente.Dni = datos.dni;

            if (datos.fecha_nacimiento != null) {
              this.fecha = datos.fecha_nacimiento;
            }
            if (datos.edad != null) {
              this.paciente.Edad = datos.edad;
            }
            if (datos.direccion != null) {
              this.paciente.Direccion = datos.direccion;
            }
            if (datos.celular != null) {
              this.paciente.Celular = datos.celular;
            }
            if (datos.whatsapp != null) {
              this.paciente.Whatsapp = datos.whatsapp;
            }
            if (datos.email != null) {
              this.paciente.Correo = datos.email;
            }
            if (datos.facebook != null) {
              this.paciente.NombreFacebook = datos.facebook;
            }
            if (datos.contactoCentroM != null) {
              this.paciente.Formacontactar = datos.contactoCentroM;
            }

            if (datos.motivoCons != null) {
              this.paciente.MotivoConsulta = datos.motivoCons;
            }
            if (datos.GP != null) {
              this.paciente.GP = datos.GP;
            }
            if (datos.FUR != null) {
              this.paciente.FUR = datos.FUR;
            }
            if (datos.PAP != null) {
              this.paciente.PAP = datos.PAP;
            }
            if (datos.MAC != null) {
              this.paciente.MAC = datos.MAC;
            }
            if (datos.RAM != null) {
              this.paciente.RAM = datos.RAM;
            }
            if (datos.antecedenteP != null) {
              this.paciente.AntecendesPersonales = datos.antecedenteP;
            }
            if (datos.antecedenteF != null) {
              this.paciente.AntecendesFamiliares = datos.antecedenteF;
            }
            if (datos.pa != null) {
              this.paciente.PA = datos.pa;
            }
            if (datos.t != null) {
              this.paciente.T = datos.t;
            }
            if (datos.fc != null) {
              this.paciente.FC = datos.fc;
            }
            if (datos.fr != null) {
              this.paciente.FR = datos.fr;
            }
            if (datos.peso != null) {
              this.paciente.Peso = datos.peso;
            }
            if (datos.talla != null) {
              this.paciente.Talla = datos.talla;
            }

            if (datos.Comentclinico != null) {
              this.paciente.ComentarioExamenClinico = datos.Comentclinico;
            }
            if (datos.DocLaboratorio!=null) {
              this.paciente.documentoLabotario = datos.DocLaboratorio;
              this.documentoPaciente=false;
            }else{
              this.documentoPaciente=true;
            }
            
            
            if (datos.imageneologia != null) {
              this.paciente.imageneologia = datos.imageneologia;
            }
            if (datos.pcita != null) {
              this.proximaCita = datos.pcita;
            }

            if (datos.diagnostico[0] == "") {
              datos.diagnostico[0] = "null";
            }
            if (datos.diagnostico[0] != "null") {
              localStorage.setItem(
                "Diagnostico",
                JSON.stringify(datos.diagnostico)
              );
            } else {
              this.paciente.diagnostico = datos.diagnostico;
            }
   
            this.mostraandoDiagnostico();
          });
      }
    });
  }

  //-------------------------------------SUBIR INDICACIONES DEL DOCTOR CON SUS MEDICAMENTOS-----------------------------
  EnviarIndicaciones(Datos) {
    if (Datos.valid) {
      this.indicacion.formingerir=this.indicacionDoctor;
      this.indicacionDoctor="";
      this._IndicacionesMedicas
        .InsertarIndicaciones(this.token, this.indicacion)
        .subscribe((respuesta) => {
          if ((respuesta._body = "ok")) {
            this.opcionesIndicaciones=true;
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Se Almaceno Correctamente la Indicacion",
              showConfirmButton: false,
              timer: 3000,
            });
            this.MostrarIndicaciones(this.id_indicaciones);
            Datos.reset();
          }
        });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Debe escribir los campos requeridos",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }

  MostrarIndicaciones(id) {
    this._IndicacionesMedicas
      .listarIndicacionesPaciente(this.token, id)
      .subscribe((respuesta) => {
        if (respuesta.length>0) {
          this.opcionesIndicaciones=true;
        } 
        this.recibirindicaciones = respuesta;
        // NOTA PARA QUITAR TEXTO ENRIQUECIDO EN ANGULAR SE
        // USA [innerHTML]="indicacion.formingerir" en el <td>
      });
  }

  ExportarDatos() {
    const link = document.createElement("a");
    link.target = "_blank";
    link.setAttribute("visibility", "hidden");
    link.target = "_blank";
    link.href = this.ReportePdf + this.id_indicaciones;
    link.click();
  }

  VaciarIndicaciones() {
    this._IndicacionesMedicas
      .VaciarIndicicaciones(this.token, this.id_indicaciones)
      .subscribe((respuesta) => {
        // console.log(respuesta);
        if (respuesta == "ok") {
          this.opcionesIndicaciones=false;
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Se elimino correctamente la Indicación",
            showConfirmButton: false,
            timer: 3000,
          });
          this.MostrarIndicaciones(this.id_indicaciones);
        }
      });
  }

  AlmacenarIndicaciones() {
    console.log(this.id_indicaciones);
    this._IndicacionesMedicas
      .AlmacenarIndicicaciones(this.token, this.id_indicaciones)
      .subscribe((respuesta) => {
        // console.log(respuesta);
        if (respuesta == "ok") {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Se Almaceno correctamente la Indicación",
            showConfirmButton: false,
            timer: 3000,
          });
          this.MostrarIndicaciones(this.id_indicaciones);
        }
      });
  }
}
