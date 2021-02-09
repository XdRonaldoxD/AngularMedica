import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccoutSettingComponent } from './accout-setting/accout-setting.component';
import { RegistrarpacienteComponent } from './registrarpaciente/registrarpaciente.component';
import { HistoriaPacienteComponent } from './historia-paciente/historia-paciente.component';
import { QuillComponent } from './quill/quill.component';
import { VerificaTokenGuard } from '../services/token/verifica-token.guard';
import { EnviarMensajeComponent } from './enviar-mensaje/enviar-mensaje.component';
import { PerfilComponent } from './perfil/perfil.component';
const pagesRoutes : Routes =[

      {
      //COMO ESTA VACIO LA RUTA ENTRA A ESTE COMPONENTE
    path: "",
    component: PagesComponent,
    children: [
      //RUTAS HIJAS
      { 
        path: "dashboard",
         component: DashboardComponent,
         canActivate:[VerificaTokenGuard]
        },
      { path: "HistoriaMedica", component: ProgressComponent,canActivate:[VerificaTokenGuard] },
      { path: "GraficaMedico", component: Graficas1Component ,canActivate:[VerificaTokenGuard]},
      { path: "Doctores", component: AccoutSettingComponent ,canActivate:[VerificaTokenGuard]},
      { path: "HistoriaMedica/:Paciente", component: ProgressComponent ,canActivate:[VerificaTokenGuard]},
      { path: "RegistrarPaciente", component: RegistrarpacienteComponent,canActivate:[VerificaTokenGuard] },
      // { path: "Quill", component: QuillComponent },
      { path: "RegistrarPaciente/:id_Paciente", component: RegistrarpacienteComponent ,canActivate:[VerificaTokenGuard]},
      { path: "HistorialPaciente/:id_Paciente", component: HistoriaPacienteComponent,canActivate:[VerificaTokenGuard] },
      { path: "EnvioMensaje/:id_Paciente", component: EnviarMensajeComponent,canActivate:[VerificaTokenGuard] },
      { path: "Perfil", component: PerfilComponent,canActivate:[VerificaTokenGuard] },
      //si la ruta es vacio redirecciona al dashboard
      { path: "", redirectTo: "/login", pathMatch: "full" },
    ],
  },

];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);