import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserService } from "../../services/Usuario/user.service";
import { Router } from "@angular/router";
import { User } from "../../models/user";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { error } from "protractor";
import Swal from "sweetalert2";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-accout-setting",
  templateUrl: "./accout-setting.component.html",
  styleUrls: ["./accout-setting.component.css"],
})
export class AccoutSettingComponent implements OnDestroy, OnInit {
  submitted = false;
  dnivalido = false;
  dniExistente = false;
  //Datatable
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  dtOptions: DataTables.Settings = {};
  informacion: any;
  informacionDeshabilitado: any;
  dtTrigger = new Subject();
  dtTrigger2 = new Subject();

  public user: User;
  modalRef: BsModalRef;

  //Identificacion del usuario
  identity: any;
  token: any;
  //Recibe datos a la data
  data: any;

  constructor(
    private Http: HttpClient,
    public _userServicie: UserService,
    private _route: Router,
    private modalService: BsModalService
  ) {
    this.token = this._userServicie.getToken();
    this.identity = this._userServicie.getIdentity();
    this.user = new User(
      1,
      "",
      "",
      "",
      "",
      "ROLE_DOCTOR",
      "",
      "",
      "",
      "",
      "",
      ""
    );
  }

  ngOnInit() {
    if (!this.identity) {
      this._route.navigate(["/login"]);
    }
    this.identity;
    this.listarDoctores();
    this.listarDoctoresDeshabilitado();
    let size=document.querySelector('.size-pantalla');
    if (screen.width < 1024) {
      console.log("Pequeño");
      size.classList.add('table-responsive');
    }
 else {
    if (screen.width < 1280) {
      size.classList.add('table-responsive');
    }else{
      console.log("Grande");
      size.classList.remove('table-responsive');
    }
  }
  }
  cagar() {
    let tabla = document.querySelector("#tabla_doctor");
    let carga = document.querySelector("#cargando");
    carga.classList.remove("d-block");
    carga.classList.add("d-none");
    tabla.classList.remove("d-none");
  }

  files: File[] = [];

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  listarDoctores() {
    let headers=new HttpHeaders()
    .set('Authorization',this.token);
    const that = this;
    this.dtOptions[0] = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      destroy: true,
      // scrollX:true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
      ajax: (dataTablesParameters: any, callback) => {
          dataTablesParameters.usuario_id=this.identity.sub;
        that.Http.post<DataTablesResponse>(
          "http://127.0.0.1:8000/api/usuarios/listado",
          dataTablesParameters,{headers:headers}
        ).subscribe((resp) => {
          this.informacion = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: [],
          });
        });
      },
      columns: [
        {
          sWidth: "35%"
        },
        {
          sWidth: "25%"
        },
        {
          sWidth: "15%"
        },
        {
          sWidth: "25%"
        },
      ],
    };
  }

  listarDoctoresDeshabilitado() {
    let headers=new HttpHeaders()
    .set('Authorization',this.token);
    const that = this;
    this.dtOptions[1] = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      destroy: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.usuario_id=this.identity.sub;
        that.Http.post<DataTablesResponse>(
          "http://127.0.0.1:8000/api/usuarios/listado/deshablitado",
          dataTablesParameters,{headers:headers}
        ).subscribe((resp) => {
          this.informacionDeshabilitado = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: [],
          });
        });
      },
      columns: [
        {
          sWidth: "35%"
        },
        {
          sWidth: "25%"
        },
        {
          sWidth: "15%"
        },
        {
          sWidth: "25%"
        },
      ],
    };
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtTrigger2.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }

  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
    }
  }

  EnviandoDoctor(Dato) {
    if (
      this.user.nombre != "" &&
      this.user.apellido != "" &&
      this.user.dni != "" &&
      this.user.email != "" &&
      this.user.password != "" &&
      this.dnivalido == false &&
      this.dniExistente == false
    ) {
      this._userServicie
        .registerDoctor(this.token, this.user, this.files)
        .subscribe((resp) => {
          //Vacia el formulario
          this.files = [];
          Dato.reset();
          console.log(resp);
          //Primero destruimos la tablas y lo vuelve a generar(listarDoctores)
     
          this.rerender();
            this.dtTrigger2.next();
            this.listarDoctores();
            this.modalRef.hide();
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Doctor registrado Correctamente",
              showConfirmButton: false,
              timer: 2000,
            });
  
        });
    } else {
      console.log("No hay datos");
    }
  }

  //EDITAR DOCTOR
  EditarDoctores(Dato) {
    if (
      this.user.nombre != "" &&
      this.user.apellido != "" &&
      this.user.email != "" &&
      this.dnivalido == false &&
      this.dniExistente == false &&
      this.user.id_doctor != ""
    ) {
      this._userServicie
        .EditarDoctor(this.token, this.user, this.files)
        .subscribe((resp) => {
          //Vacia el formulario
          this.files = [];
          Dato.reset();

          //Primero destruimos la tablas y lo vuelve a generar(listarDoctores)
          this.rerender();
          setTimeout(() => {
            this.dtTrigger2.next();
          });
          this.modalRef.hide();
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Se registro el Doctor Correctamente",
            showConfirmButton: false,
            timer: 2000,
          });
        });
    } else {
      console.log("No hay datos");
    }
  }

  //Limpiando Data usuario(Doctor)
  limpiar() {
    this.user.apellido = "";
    this.user.celular = "";
    this.user.direccion = "";
    this.user.dni = "";
    this.user.nombre = "";
    this.user.email = "";
    this.user.id_doctor = "";
  }
  //habrir el modal
  openModal(template: TemplateRef<any>) {
    //Modal Estatico
    this.limpiar();
    this.modalRef = this.modalService.show(template, {
      class: "modal-lg",
      backdrop: "static",
    });
  }
  openModalEdit(Edittemplate: TemplateRef<any>, id) {
    //Modal Estatico
    this.submitted = false;
    this.limpiar();
    this._userServicie.TraerDatosDoctor(this.token, id).subscribe((respu) => {
      console.log(respu);
      this.user.apellido = respu.apellido;
      this.user.celular = respu.celular;
      this.user.direccion = respu.direccion;
      this.user.dni = respu.dni;
      this.user.nombre = respu.nombre;
      this.user.email = respu.email;
      this.user.id_doctor = respu.id;
    });
    this.modalRef = this.modalService.show(Edittemplate, {
      class: "modal-lg",
      backdrop: "static",
    });
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

  EliminarDoctor(id, nombre) {
    Swal.fire({
      title: "¿Esta seguro de deshabilitar al doctor " + nombre + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si!",
    }).then((result) => {
      if (result.value) {
        this._userServicie
          .DeshabilitarDoctor(this.token, id)
          .subscribe((respu) => {
            console.log(respu);
          });
        this.rerender();
        setTimeout(() => {
          this.dtTrigger2.next();
        });

        Swal.fire("Deshabilitado!", "Doctor deshabilitado.", "success");
      }
    });
  }

  ActivarDoctor(id, nombre) {
    Swal.fire({
      title: "¿Esta seguro de Activar al doctor " + nombre + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si!",
    }).then((result) => {
      if (result.value) {
        this._userServicie
          .habilitarDoctor(this.token, id)
          .subscribe((respu) => {
            console.log(respu);
          });
        this.rerender();
        setTimeout(() => {
          this.dtTrigger2.next();
        });

        Swal.fire("Activado!", "Doctor Activado.", "success");
      }
    });
  }
}
