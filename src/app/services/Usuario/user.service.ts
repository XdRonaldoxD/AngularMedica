import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Http } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  token:any;
  UserIdentificado:any;

  linkApi = 'http://127.0.0.1:8000/api/';
  constructor(
    private httpcliente: HttpClient,
    private http: Http,
  ) {
 
   }

   register(user):Observable<any>{
     let json=JSON.stringify(user);
     let params='json='+json;
     let headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

     return this.httpcliente.post(this.linkApi+'registrado',params,{headers:headers})
   }

   login(user,getToken=null):Observable<any>{
     if (getToken !=null) {
         user.getToken='true'
     }
    let json=JSON.stringify(user);
    let params='json='+json;
    let headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

    return this.httpcliente.post(this.linkApi+'login',params,{headers:headers})
  }

  cerrarSession(id_user):Observable<any>{
    let json=JSON.stringify(id_user);
    let params='json='+json;
    let headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

    return this.httpcliente.post(this.linkApi+'EliminarSession',params,{headers:headers})
  }

  

  getIdentity(){
    let identity=JSON.parse(localStorage.getItem('UserIdentificado'));
    if (identity && identity!='undefined') {
      this.UserIdentificado=identity;
    }else{
      this.UserIdentificado=null;
    }
    return this.UserIdentificado;
  }
  getToken(){
    let token=localStorage.getItem('token');
    if (token && token!='undefined') {
      this.token=token;
    }else{
      this.token=null;
    }
    return this.token;
  }

  listarUsuario(token):Observable<any>{
    let headers=new HttpHeaders()
    .set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);
    return this.httpcliente.get(this.linkApi+'usuarios/listado',{headers:headers})
  }

  registerDoctor(token,user):Observable<any>{
    let json=JSON.stringify(user);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'registrarEditDoctor',params,{headers:headers})
  }
  EditarDoctor(token,user):Observable<any>{
    let json=JSON.stringify(user);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'registrarEditDoctor',params,{headers:headers})
  }

  emailValido(token,email):Observable<any>{
    let json=JSON.stringify(email);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'EmailExistente',params,{headers:headers})

  }
 
  ValidarDNI(dni):Observable<any>{
    let headers=new HttpHeaders()
    return this.httpcliente.get(`https://dniruc.apisperu.com/api/v1/dni/${dni}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNtaXRoeGQxMThAZ21haWwuY29tIn0.24c7XETuRuTQLUqSjOH7BsKM19n6kKMOtY06qeUYX40`,{headers:headers})
  }

  DniExistente(token,dni):Observable<any>{
    let json=JSON.stringify(dni);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'DniExistente',params,{headers:headers})
  }

  DeshabilitarDoctor(token,id):Observable<any>{
    let json=JSON.stringify(id);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'Deshabilitar',params,{headers:headers})
  }

  TraerDatosDoctor(token,id):Observable<any>{
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.get(this.linkApi+'GetDoctorId/'+id,{headers:headers})
  }
}
