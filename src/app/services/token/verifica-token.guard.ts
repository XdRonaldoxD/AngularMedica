import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../Usuario/user.service";

@Injectable({
  providedIn: "root",
})
export class VerificaTokenGuard implements CanActivate {
  constructor(public _userServicio: UserService, private _route: Router) {}
  canActivate(): Promise<boolean> | boolean {
    // console.log("Iniciando Guard Token");
    let token = this._userServicio.getToken();
    let identity = this._userServicio.getIdentity();
    if (token != null) {
      let payload = JSON.parse(atob(token.split(".")[1]));
      let expirado = this.expirado(payload.expiracion);
      if (expirado) {
        this._route.navigate(["/login"]);
        // console.log("expiro necesita renovar el token");
      }
      this._userServicio.VerificacionUser(token,payload.sub,identity.session_id)
        .subscribe((respo) => {
          if (respo==true) {
            // this._userServicio.cerrarSession(identity.sub);
            localStorage.removeItem("UserIdentificado");
            localStorage.removeItem("token");
            this._route.navigate(["/login"]);
          }
        });
    }
    //atob decodifica una cadena de datos en este caso va ser el token decodificar

    return true;
  }

  expirado(fechaExp: number) {
    let ahora = new Date().getTime() / 1000;
    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }
}
