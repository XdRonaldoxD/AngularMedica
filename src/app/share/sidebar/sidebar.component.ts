import { Component, OnInit } from "@angular/core";
import { SidebarService } from "../../services/service.index";
import { UserService } from "../../services/Usuario/user.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { element, error } from "protractor";
import { Observable } from "rxjs";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  identity: any;
  token: any;
  submenus: any;
  constructor(
    public _sidebar: SidebarService,
    public _userServicie: UserService,
    private _route: Router,
    private _activateRoute: ActivatedRoute
  ) {
    this.identity = this._userServicie.getIdentity();
    // if(this.identity.tipo_usuario=='ROLE_USER'){
    //CASO OBSERVABLE->Tiene mas condiciones q la promesas
    let obs = new Observable((observer) => {
      let contado = 1;
      let intervalo = setInterval(() => {
        this.identity = this._userServicie.getIdentity();
        // console.log(this.identity);
        contado += 1;
        observer.next(contado);
        if (this.identity == null) {
          clearInterval(intervalo);
          observer.complete();
        }
      }, 1000);
    });
    obs.subscribe(
      (nume) => {
        //Se dispara el next q muestra el numero
        // console.log(nume);
      },
      (error) => {
        console.error("Error", error);
      },
      () => {
        console.log("El observador termino");
      }
    );
    // }



  }

  ngOnInit() {
    if (!this.identity) {
      this._route.navigate(["/login"]);
    }
    //Se ejecuta siempre y cuando solo le llega por el parametro el sure por la url con valor 1 -> fija html le envia 1
    this.logout();
    this.validandoSidebar();
  }

  logout() {
    this._activateRoute.params.subscribe((params) => {
      let logout = +params["sure"];
      if (logout == 1) {
        this._userServicie
          .cerrarSession(this.identity.sub)
          .subscribe((respo) => {
            console.log(respo);
          });
        localStorage.removeItem("UserIdentificado");
        localStorage.removeItem("token");

        this._route.navigate(["/login"]);
      }
    });
  }

  validandoSidebar() {
    // console.log(this.identity);
    var titulos = this._sidebar.menu[0].submenu;
    // console.log(titulos);
    if (this.identity.tipo_usuario == "ROLE_DOCTOR") {
      this.submenus = [];
      titulos.forEach((element, index) => {
        if (index == 0 || index == 1 || index == 2) {
          this.submenus.push(element);
        }
      });
    } else {
      this.submenus = titulos;
    }
    // console.log(this.submenus);
  }

  verificarToken() {}
}
