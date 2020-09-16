import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";

import { NopagefoundComponent } from "./share/nopagefound/nopagefound.component";

import { RegisterComponent } from './login/register.component';
import { SidebarComponent } from './share/sidebar/sidebar.component';



const appRoutes: Routes = [
  // {
  //     //COMO ESTA VACIO LA RUTA ENTRA A ESTE COMPONENTE
  //   path: "",
  //   component: PagesComponent,
  //   children: [
  //     //RUTAS HIJAS
  //     { path: "dashboard", component: DashboardComponent },
  //     { path: "progress", component: ProgressComponent },
  //     { path: "graficas", component: Graficas1Component },
  //     //si la ruta es vacio redirecciona al dashboard
  //     { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  //   ],
  // },
  { path: "login", component: LoginComponent },
  { path: "logout/:sure", component: SidebarComponent },
  { path: "register", component: RegisterComponent },
  { path: "**", component: NopagefoundComponent },
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true });
