import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/Usuario/user.service";
import { HistoriapacienteService } from "../../services/paciente/historiapaciente.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import { each } from "jquery";
import { element } from 'protractor';
@Component({
  selector: "app-graficas1",
  templateUrl: "./graficas1.component.html",
  styleUrls: ["./graficas1.component.css"],
})
export class Graficas1Component implements OnInit {
  // GRAFICA DE DONA
  // grafico: any = {
  //   graficos: {
  //     labels: ["Con frijoles", "Con Natalia", "Con tocio"],
  //     data: [24, 30, 46],
  //     type: "pie",
  //     leyenda: "El pan se come con",
  //   },
  //   graficos2: {
  //     labels: ["Hombre", "Mujeres"],
  //     data: [4500, 6000],
  //     type: "pie",
  //     leyenda: "Entrevistas",
  //   },
  //   graficos3: {
  //     labels: ["Si", "NO"],
  //     data: [95, 5],
  //     type: "pie",
  //     leyenda: "¿Le dan gases los frejoels?",
  //   },
  //   graficos4: {
  //     labels: ["Si", "No", "Talves"],
  //     data: [30, 40, 50],
  //     type: "pie",
  //     leyenda: "¿Esta bueno el trabajo?",
  //   },
  // };

  // GRAFICA DE DONA FIN
  fechaIncio: any = this.datePipe.transform(new Date(), "2020-01-01");
  fechaFin: any = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  public token: any;

  //grafico de barras
  public barCharOptions: any = {
    scaleShowVerticalLines: false,
    reponsive: true,
  };

  public barChartLabels: string[] = [
    // "Enero",
    // "Febrero",
    // "Marzo",
    // "Abril",
    // "Mayo",
    // "Junio",
    // "Julio",
    // "Agosto",
    // "Septiembre",
    // "Octubre",
    // "Noviembre",
    // "Diciembre",
  ];
  public barChartType: string = "bar";
  public texto: string = "Paciente";
  public barChartLegend: boolean = true;
  public barChartData: any[] = [
    {
      data: [],
      label: "",
    },
  ];
  constructor(
    public _userservico: UserService,
    public _historiaPaciente: HistoriapacienteService,
    private datePipe: DatePipe
  ) {}
  ngOnInit() {
    this.token = this._userservico.getToken();
    this.mostrandoGrafica();
  }
  // events para la grafica de barras
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
  //FIN DEL EVENTOS

  public mostrandoGrafica() {
    let fechaInciohtml: any = document.querySelector(".fechaIncio");
    let fechaFinhtml: any = document.querySelector(".fechaFin");
    if (this.fechaIncio > this.fechaFin) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "La Fecha Inicial no puede ser mayor.",
        showConfirmButton: false,
        timer: 5000,
      });

      fechaInciohtml.classList.add("is-invalid");
      return false;
    }
    fechaInciohtml.classList.remove("is-invalid");
    let fechaInicial=this.fechaIncio.split('-');
    let fechaFinal=this.fechaFin.split('-');
    if ( parseFloat(fechaInicial[0]) == parseFloat(fechaFinal[0]) ) {
      fechaInciohtml.classList.remove("is-invalid");
      fechaFinhtml.classList.remove("is-invalid");
    }else{
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Las Fechas deben de ser del mismo año.",
        showConfirmButton: false,
        timer: 5000,
      });
      fechaInciohtml.classList.add("is-invalid");
      fechaFinhtml.classList.add("is-invalid");
      return false;
    }
    let datos = {
      fechaIncio: this.fechaIncio,
      FechaFin: this.fechaFin,
    };
    this._historiaPaciente
      .TraerDatosGraficos(this.token, datos)
      .subscribe((doc) => {
        let respuesta = JSON.parse(doc._body);
        let cantidad = "";
        let mes = "";
        respuesta.cantidadmes.forEach((elementos) => {
          cantidad += elementos + ",";
        });
        respuesta.mes.forEach((element) => {
          mes += `"${element}",`;
        });
        let cantidadEscogido = cantidad.substring(0, cantidad.length - 1);
        let mesEscogido = mes.substring(0, mes.length - 1);
        let cantidadEs=cantidadEscogido.split(',');
        let mesEsc=mesEscogido.split(',');
        this.barChartData[0].label=[`Paciente atendido durante el mes en el año ${fechaInicial[0]}`]
        switch (respuesta.cantidadmes.length) {
          case 1:
            this.barChartData[0].data = [cantidadEs[0]];
            this.barChartLabels = [mesEsc[0]];
            break;
          case 2:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1]];
            this.barChartLabels = [mesEsc[0],mesEsc[1]];
            break;
          case 3:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1],cantidadEs[2]];
            this.barChartLabels = [mesEsc[0],mesEsc[1],mesEsc[2]];
            break;
          case 4:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1],cantidadEs[2],cantidadEs[3]];
            this.barChartLabels = [mesEsc[0],mesEsc[1],mesEsc[2],mesEsc[3]];
            break;
          case 5:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1],cantidadEs[2],cantidadEs[3],cantidadEs[4]];
            this.barChartLabels = [mesEsc[0],mesEsc[1],mesEsc[2],mesEsc[3],mesEsc[4]];
            break;
          case 6:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1],cantidadEs[2],cantidadEs[3],cantidadEs[4],cantidadEs[5]];
            this.barChartLabels = [mesEsc[0],mesEsc[1],mesEsc[2],mesEsc[3],mesEsc[4],mesEsc[5]];
            break;
          case 7:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1],cantidadEs[2],cantidadEs[3],cantidadEs[4],cantidadEs[5],cantidadEs[6]];
            this.barChartLabels = [mesEsc[0],mesEsc[1],mesEsc[2],mesEsc[3],mesEsc[4],mesEsc[5],mesEsc[6]];
            break;
          case 8:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1],cantidadEs[2],cantidadEs[3],cantidadEs[4],cantidadEs[5],cantidadEs[6],cantidadEs[7]];
            this.barChartLabels = [mesEsc[0],mesEsc[1],mesEsc[2],mesEsc[3],mesEsc[4],mesEsc[5],mesEsc[6],mesEsc[7]];
            break;
          case 9:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1],cantidadEs[2],cantidadEs[3],cantidadEs[4],cantidadEs[5],cantidadEs[6],cantidadEs[7],cantidadEs[8]];
            this.barChartLabels = [mesEsc[0],mesEsc[1],mesEsc[2],mesEsc[3],mesEsc[4],mesEsc[5],mesEsc[6],mesEsc[7],mesEsc[8]];
            break;
          case 10:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1],cantidadEs[2],cantidadEs[3],cantidadEs[4],cantidadEs[5],cantidadEs[6],cantidadEs[7],cantidadEs[8],cantidadEs[9]];
            this.barChartLabels = [mesEsc[0],mesEsc[1],mesEsc[2],mesEsc[3],mesEsc[4],mesEsc[5],mesEsc[6],mesEsc[7],mesEsc[8],mesEsc[9]];
            break;
          case 11:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1],cantidadEs[2],cantidadEs[3],cantidadEs[4],cantidadEs[5],cantidadEs[6],cantidadEs[7],cantidadEs[8],cantidadEs[9],cantidadEs[10]];
            this.barChartLabels = [mesEsc[0],mesEsc[1],mesEsc[2],mesEsc[3],mesEsc[4],mesEsc[5],mesEsc[6],mesEsc[7],mesEsc[8],mesEsc[9],mesEsc[10]];
            break;
          case 12:
            this.barChartData[0].data = [cantidadEs[0],cantidadEs[1],cantidadEs[2],cantidadEs[3],cantidadEs[4],cantidadEs[5],cantidadEs[6],cantidadEs[7],cantidadEs[8],cantidadEs[9],cantidadEs[10],cantidadEs[11]];
            this.barChartLabels = [mesEsc[0],mesEsc[1],mesEsc[2],mesEsc[3],mesEsc[4],mesEsc[5],mesEsc[6],mesEsc[7],mesEsc[8],mesEsc[9],mesEsc[10],mesEsc[11]];
            break;
          default:
            this.barChartData[0].data = [];
            this.barChartLabels = [];
            break;
        }
      });
  }

  public randomize(): void {
    // Only Change 3 values
    console.log(this.barChartData[0]);
    this.barChartData[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.random() * 100,
      56,
      Math.random() * 100,
      40,
      Math.random() * 100,
    ];
  }
}
