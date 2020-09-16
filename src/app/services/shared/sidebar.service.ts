import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  menu: any = [
    {
      titulo: "Inicio",
      icono: "fa fa-user-md",
      submenu: [
        {
          titulo: "Medicos",
          url: "/Doctores",
          icono:"fa fa-user-circle-o",
        },
        {
          titulo: "Historia Clinica ",
          url: "/HistoriaMedica",
          icono:"fa fa-address-card",
        },  
        // {
        //   titulo: "Historia del Paciente",
        //   url: "/HistorialPaciente",
        //   icono:"fa fa-file-text-o",
        // },
        // {
        //   titulo: "Historia del Paciente",
        //   url: "/HistoriaPaciente",
        //   icono:"fa fa-file-text-o",
        // },
      ],
    },
  ];

  constructor() {}
}
