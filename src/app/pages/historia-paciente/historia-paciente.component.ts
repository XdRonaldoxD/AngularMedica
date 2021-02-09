import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Paciente } from "../../models/paciente";
import { DatePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HistoriapacienteService } from "../../services/paciente/historiapaciente.service";
import { UserService } from "../../services/Usuario/user.service";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { DocumentoLaboratorio } from "src/app/services/documentoLaboratorio/Documento.service";
import Swal from "sweetalert2";
import * as fileSaver from "file-saver";
import { HttpHeaders, HttpClient } from '@angular/common/http';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-historia-paciente",
  templateUrl: "./historia-paciente.component.html",
  styleUrls: ["./historia-paciente.component.css"],
})
export class HistoriaPacienteComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  fecha: any = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm");
  public paciente: Paciente;
  token: any;
  id_paciente: any;
  dataDocumento: any;
  resetVar= false;
  usuario_id:any;
  medico:any;
  guardar=true;
  loading=false;
  visibleDocumento:boolean=false;
  ReportePdf:any="http://127.0.0.1:8000/api/Paciente/Reporte/";
  constructor(
    private datePipe: DatePipe,
    private _activateRoute: ActivatedRoute,
    public _HistoriaPaciente: HistoriapacienteService,
    public _userservico: UserService,
    public _Documento: DocumentoLaboratorio,
    private Http: HttpClient
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
    this.visibleDocumento=false;
    this.token = this._userservico.getToken();
    this.MostrandoPaciente();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the  (Datatable)
    this.dtTrigger.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();

  }
  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
    }
  }
  // Saber si se renovara o editar el paciente
  MostrandoPaciente() {
    this._activateRoute.params.subscribe((params) => {
      this.id_paciente = +params["id_Paciente"];
      if (!isNaN(this.id_paciente)) {
        this._Documento
          .TraerDatoPaciente(this.token, this.id_paciente)
          .subscribe((datos) => {
            this.medico=datos.DocLaboratorio;
            this.usuario_id=datos.user_id;
            this.paciente.id_paciente=datos.id;
            this.paciente.NumeroCitaMedica = datos.nCitamed;
            this.paciente.NombrePaciente = datos.nombre;
            this.paciente.ApellidoPaciente = datos.apellido;
            this.paciente.Edad = datos.edad;
            this.paciente.FechaNaciemto = datos.fecha_nacimiento;
          });
          this.ListarDocumento(this.id_paciente);
      }
    });
  }
  ListarDocumento(id_paciente) {
 
    let headers=new HttpHeaders()
    .set('Authorization',this.token);
    const that = this;
    this.dtOptions[0] = {
      pagingType: "full_numbers",
      pageLength: 3,
      serverSide: true,
      processing: true,
      responsive: true,
      destroy: true,
      // scrollX:true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
      ajax: (dataTablesParameters:any, callback) => {
        dataTablesParameters.id_paciente=id_paciente;

        that.Http.post<DataTablesResponse>(
          "http://127.0.0.1:8000/api/TraerDocumento",
          dataTablesParameters,{headers:headers}
        ).subscribe((resp) => {
          this.dataDocumento = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data:[],
          });
        }),error=>{
          console.log(error);
        };
      },
      columns: [
        {
          sWidth:"15%"
        },
        {
          sWidth:"45%"
        },
        {
          sWidth:"25%"
        },
        {
          sWidth:"25%"
        }
      ],
    };


  }


  public pending: boolean = false;
  ExportarDato(id){
    Swal.fire({
      title: 'GENERANDO HISTORIA CLINICA COMPLETA DEL PACIENTE',
      html: 'Generando...',
      text: 'Generando...',
      allowOutsideClick: false,
      showConfirmButton: false,
      onOpen: () => {
        Swal.showLoading();
        let self = this;
        this.pending = true;
        let xhr = new XMLHttpRequest();
        let url = `${this.ReportePdf + 'HistoriaClinica/'+ id}?lang=en`;
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
  VisualizarDocumento(){
    // let a = document.createElement("a");
    // a.target = "_blank";
    // a.setAttribute("visibility", "hidden");
    // a.href = "http://sangeronimohistoriaclinica.com/pdf-viewer-master/external/pdfjs-2.1.266-dist/web/vista.html" ;
    // a.click();
    this.visibleDocumento=true;
  }
  
  MostrarDocumento(file_name){
    let a = document.createElement("a");
    a.target = "_blank";
    a.setAttribute("visibility", "hidden");
    a.href = this.ReportePdf +"Documento/" + file_name;
    a.click();

  }
  LimpiarDocumento(){
    this.paciente.documentoLabotario="";
  }
  GuardarDocumento(){
    this.loading=true;
    if (this.paciente.documentoLabotario!="") {
      this.resetVar=true;
      this._Documento.InsertarDocumentoLaboratorio(this.token,this.usuario_id,this.paciente.id_paciente,this.paciente.documentoLabotario).subscribe(
        (datos=>{
          if (datos="ok") {
            this.LimpiarDocumento();
            this.guardar=true;
            this.loading=false;
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Se Guardo Correctamente el Documento",
              showConfirmButton: false,
              timer: 3000,
            });
            this.rerender();
          }
        })
        
      )
    }else{
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Hubo un error al subir el Documento",
        showConfirmButton: false,
        timer: 3000,
      });
    }

  }
 
  PdfPacienteSubido(datos) {
    console.log(datos);
    this.paciente.documentoLabotario = datos.body.pdf;
    this.guardar=false;
    this.resetVar=false;
  }
    //Para subir la imagen del API
    
    DocumentoLaboratioPdf = {
      multiple: false,
      formatsAllowed: ".pdf",
      maxSize: "50",
      uploadAPI: {
        url: "http://127.0.0.1:8000/api/login/Paciente/pdf/update",
        method: "POST",
        // headers: {
        //   Authorization: this.token,
        // },
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
        attachPinBtn: "Suba el documento del Paciente",
        afterUploadMsg_success: "Successfully Uploaded !",
        afterUploadMsg_error: "Upload Failed !",
        sizeLimit: "Size Limit",
      },
    };



  EliminarDocumento(id_documento) {
    this._Documento.EliminarDocumento(this.token,id_documento)
    .subscribe((resp=>{
      console.log(resp);
      if (resp="ok") {
        this.LimpiarDocumento();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Se Eliminado Correctamente el Documento",
          showConfirmButton: false,
          timer: 3000,
        });
        this.rerender();
      }
    }))
  }
 
}
