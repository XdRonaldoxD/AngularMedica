import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../services/Usuario/user.service";
import { Subject } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { HistoriapacienteService } from "../../services/paciente/historiapaciente.service";
import Swal from "sweetalert2";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Paciente } from "../../models/paciente";

import * as html2pdf from "html2pdf.js";
import * as fileSaver from "file-saver";

@Component({
  selector: "app-progress",
  templateUrl: "./progress.component.html",
  styleUrls: ["./progress.component.css"],
})
export class ProgressComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  ReportePdf = "http://127.0.0.1:8000/api/Paciente/Reporte/";
  public url: any = "http://127.0.0.1:8000/api/login/";
  public paciente: Paciente;
  //Identificacion del usuario
  identity: any;
  token: any;
  modalRef: BsModalRef;

  //Recibe datos a la tabla paciente
  data: any;
  diagnosticado: any;
  Tratamientos: any;
  fecha_creacion: any;
  constructor(
    public _userServicie: UserService,
    private _route: Router,
    public _HistoriaPaciente: HistoriapacienteService,
    private _activateRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {
    this.token = this._userServicie.getToken();
    this.identity = this._userServicie.getIdentity();
    this.paciente = new Paciente(
      null,
      null,
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
      "",
      "",
      "",
      "",
      [],
      "",
      "",
      ""
    );
  }

  ngOnInit() {
    if (!this.identity) {
      this._route.navigate(["/login"]);
    }
    this.listarPaciente();
    this.PacienteRegistrado();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onExportPdf() {
    console.log("click");
    const options = {
      width: [100],
      height: [100],
      filename: "archivo.pdf",
      img: { type: "jpeg", quality: 1 },
      html2Canvas: { scale: 3, letterRendering: true, useCORS: true },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        pagesplit: true,
      },
    };
    const contennido: Element = document.getElementById("element-to-export");
    html2pdf().from(contennido).set(options).save();
  }

  listarPaciente() {
    this._HistoriaPaciente
      .listarHistoriaPaciente(this.token)
      .subscribe((respuesta) => {
        this.data = respuesta;
        this.dtTrigger.next();
      });
    //Funcion del Datatable
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 5,
      ordering: false,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
  }

  //Saber si se registro el paciente
  PacienteRegistrado() {
    this._activateRoute.params.subscribe((params) => {
      let paciente = +params["Paciente"];
      if (paciente == 1) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Se registro el Paciente Correctamente",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }

  EliminarDato(nombre, id_paciente) {
    Swal.fire({
      title: "¿Esta seguro de deshabilitar el paciente " + nombre + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
    }).then((result) => {
      if (result.value) {
        this._HistoriaPaciente
          .DeshabilitarPaciente(this.token, id_paciente)
          .subscribe((respu) => {
            console.log(respu);
          });
        this.dtElement.dtInstance.then((dtInstancia: DataTables.Api) => {
          dtInstancia.destroy();
          this.listarPaciente();
        });
        Swal.fire("Deshabilitado!", "Paciente deshabilitado.", "success");
      }
    });
  }

  RenovarDato(id_paciente) {
    this._route.navigate(["/RegistrarPaciente/" + id_paciente]);
  }

  ConsultaHistoria(id_paciente) {
    this._route.navigate(["/HistorialPaciente/" + id_paciente]);
  }

  ExportarDato(id_paciente) {
    console.log(id_paciente);
    let a = document.createElement("a");
    a.target = "_blank";
    a.setAttribute("visibility", "hidden");
    a.href = this.ReportePdf + id_paciente;
    a.click();
  }

  //HABRIENDO EL MODAL
  openModal(template: TemplateRef<any>, id_paciente) {
    //Modal Estatico
    this.modalRef = this.modalService.show(template, {
      class: "modal-lg",
      backdrop: "static",
    });
    this.MostrarPaciente(id_paciente);
  }

  public pending: boolean = false;
  openReporte(id_paciente) {
    Swal.fire({
      title: 'FICHA DEL PACIENTE',
      html: 'Generando el reporte del Paciente...',
      text: 'Generando el reporte del Paciente...',
      allowOutsideClick: false,
      showConfirmButton: false,
      onOpen: () => {
        Swal.showLoading();
        let self = this;
        this.pending = true;
        let xhr = new XMLHttpRequest();
        let url = `${this.ReportePdf + id_paciente}?lang=en`;
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
          setTimeout(() => {
          }, 0);
          if (xhr.readyState === 4 && xhr.status === 200) {
            var blob = new Blob([this.response], { type: "application/pdf" });
            fileSaver.saveAs(blob, "Historia del Paciente.pdf");
            Swal.close();
          }
        };
        xhr.send();
      }
  })
  }

  // downloadFile() {
  //   this.http.get(
  //     'https://mapapi.apispark.net/v1/images/'+this.filename).subscribe(
  //       (response) => {
  //         var mediaType = 'application/pdf';
  //         var blob = new Blob([response._body], {type: mediaType});
  //         var filename = 'test.pdf';
  //         fileSaver.saveAs(blob, filename);
  //       });
  //   }

  //MOSTRANDO INFORMACION DEL PACIENTE
  MostrarPaciente(id_paciente) {
    this._HistoriaPaciente
      .TraerDatoPaciente(this.token, id_paciente)
      .subscribe((datos) => {
        console.log(datos);
        this.paciente.NumeroCitaMedica = datos.nCitamed;
        this.fecha_creacion = datos.fecha_creacion;

        if (datos.img_perfil != null) {
          this.paciente.Imagen = datos.img_perfil;
        } else {
          this.paciente.Imagen = null;
        }
        this.paciente.NombrePaciente = datos.nombre;
        this.paciente.ApellidoPaciente = datos.apellido;
        this.paciente.SexoPaciente = datos.sexo;
        this.paciente.Dni = datos.dni;

        if (datos.fecha_nacimiento != null) {
          this.paciente.FechaNaciemto = datos.fecha_nacimiento;
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
        } else {
          this.paciente.Whatsapp = null;
        }
        if (datos.email != null) {
          this.paciente.Correo = datos.email;
        } else {
          this.paciente.Correo = null;
        }
        if (datos.facebook != null) {
          this.paciente.NombreFacebook = datos.facebook;
        } else {
          this.paciente.NombreFacebook = null;
        }
        if (datos.contactoCentroM != null) {
          this.paciente.Formacontactar = datos.contactoCentroM;
        } else {
          this.paciente.Formacontactar = null;
        }

        if (datos.motivoCons != null) {
          this.paciente.MotivoConsulta = datos.motivoCons;
        } else {
          this.paciente.MotivoConsulta = null;
        }
        if (datos.GP != null) {
          this.paciente.GP = datos.GP;
        } else {
          this.paciente.GP = null;
        }
        if (datos.FUR != null) {
          this.paciente.FUR = datos.FUR;
        } else {
          this.paciente.FUR = null;
        }
        if (datos.PAP != null) {
          this.paciente.PAP = datos.PAP;
        } else {
          this.paciente.PAP = null;
        }
        if (datos.MAC != null) {
          this.paciente.MAC = datos.MAC;
        } else {
          this.paciente.MAC = null;
        }
        if (datos.RAM != null) {
          this.paciente.RAM = datos.RAM;
        } else {
          this.paciente.RAM = null;
        }
        if (datos.antecedenteP != null) {
          this.paciente.AntecendesPersonales = datos.antecedenteP;
        } else {
          this.paciente.AntecendesPersonales = null;
        }
        if (datos.antecedenteF != null) {
          this.paciente.AntecendesFamiliares = datos.antecedenteF;
        } else {
          this.paciente.AntecendesFamiliares = null;
        }
        if (datos.pa != null) {
          this.paciente.PA = datos.pa;
        } else {
          this.paciente.PA = null;
        }
        if (datos.t != null) {
          this.paciente.T = datos.t;
        } else {
          this.paciente.T = null;
        }
        if (datos.fc != null) {
          this.paciente.FC = datos.fc;
        } else {
          this.paciente.FC = null;
        }
        if (datos.fr != null) {
          this.paciente.FR = datos.fr;
        } else {
          this.paciente.FR = null;
        }
        if (datos.peso != null) {
          this.paciente.Peso = datos.peso;
        } else {
          this.paciente.Peso = null;
        }
        if (datos.talla != null) {
          this.paciente.Talla = datos.talla;
        } else {
          this.paciente.Talla = null;
        }

        if (datos.Comentclinico != null) {
          this.paciente.ComentarioExamenClinico = datos.Comentclinico;
        } else {
          this.paciente.ComentarioExamenClinico = null;
        }
        if (datos.DocLaboratorio != null) {
          this.paciente.documentoLabotario = datos.DocLaboratorio;
        } else {
          this.paciente.documentoLabotario = null;
        }
        if (datos.imageneologia != null) {
          this.paciente.imageneologia = datos.imageneologia;
        } else {
          this.paciente.imageneologia = null;
        }
        if (datos.pcita != null) {
          this.paciente.proximacita = datos.pcita;
        } else {
          this.paciente.proximacita = null;
        }

        if (datos.diagnostico[0] == "") {
          datos.diagnostico[0] = "null";
        }
        if (datos.diagnostico[0] != "null") {
          this.diagnosticado = datos.diagnostico;
        } else {
          this.diagnosticado = null;
        }
        if (datos.Tratamiento != false) {
          this.Tratamientos = datos.Tratamiento;
        } else {
          this.Tratamientos = null;
        }
      });
  }

  //Almacenar informacion del Pacinete
  AlmacenarDatoPaciente(nombre_paciente, id_paciente) {
    Swal.fire({
      title:
        "¿Esta seguro de almacenar los datos del paciente " +
        nombre_paciente +
        "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
    }).then((result) => {
      if (result.value) {
        this._HistoriaPaciente
          .AlmacenarDatoPaciente(this.token, id_paciente)
          .subscribe((datos) => {
            if (datos == "ok") {
              Swal.fire("Almacenado", "Paciente Almacenado", "success");
            } else {
              Swal.fire("Error", "No se Almaceno el Paciente ", "error");
            }
          });
      }
    });
  }
}
