import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/service.index';
import { UserService } from '../../services/Usuario/user.service';
import { Router, ActivatedRoute ,Params} from '@angular/router';
import { element } from 'protractor';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  identity:any;
  token:any;
  submenus: any;
  constructor( 
    public _sidebar:SidebarService,
    public _userServicie:UserService,
    private _route:Router,
    private _activateRoute:ActivatedRoute
    ) {
      this.identity=this._userServicie.getIdentity();
     }
  
  ngOnInit() {
    if (!this.identity) {
      this._route.navigate(['/login']);
    }
    //Se ejecuta siempre y cuando solo le llega por el parametro el sure por la url con valor 1 -> fija html le envia 1
    this.logout();
    this.validandoSidebar();
  }

  logout(){
    this._activateRoute.params.subscribe(params=>{
      let logout=+params['sure'];
      if (logout==1) {
        localStorage.removeItem('UserIdentificado');
        localStorage.removeItem('token');

        this._route.navigate(['/login']);
      }
    })
  }

  validandoSidebar(){
    // console.log(this.identity);
    var titulos= this._sidebar.menu[0].submenu;
    if (this.identity.tipo_usuario=="ROLE_DOCTOR") {
      this.submenus = [];
      titulos.forEach((element,index) => {
        if (index==1) {
          this.submenus.push(element);
        }
      });
    }else{
    this.submenus=titulos;
    }
  }

  verificarToken(){
    
  }

}
