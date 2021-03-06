import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http ,Headers} from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  token:any;
  UserIdentificado:any;

  linkApi = 'http://127.0.0.1:8000/api/';
  constructor(
    private httpcliente: HttpClient,
    private http: Http 
  ) {
 
   }

   register(user):Observable<any>{
     let json=JSON.stringify(user);
     let params='json='+json;
     let headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

     return this.httpcliente.post(this.linkApi+'registrado',params,{headers:headers})
   }

   VerificacionUser(token,user_id,session_id):Observable<any>{
    let json=JSON.stringify(user_id);
    let session=JSON.stringify(session_id);
    let params='json='+json+"/"+session;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'ConsultarUsuario',params,{headers:headers})
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
  actualizarIdentity(datos){
    let identity=JSON.parse(localStorage.getItem('UserIdentificado'));
    identity.imagen=datos.path_user;
    identity.nombre=datos.nombre;
    identity.email=datos.email;
    identity.apellido=datos.apellido;
    localStorage.setItem('UserIdentificado',JSON.stringify(identity));

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

  registerDoctor(token,user,imagen):Observable<any>{
    let formData=new FormData();
    formData.append('nombre',user.nombre)
    formData.append('apellido',user.apellido)
    formData.append('email',user.email)
    formData.append('password',user.password)
    formData.append('role',user.role)
    formData.append('direccion',user.direccion)
    formData.append('celular',user.celular)
    formData.append('dni',user.dni)
    imagen.forEach(element => {
      formData.append('imagen[]',element)
    });
    const headers = new Headers({
      Authorization:token
    });
    return this.http.post(this.linkApi+'registrarEditDoctor',formData,{headers})
  }


  EditarDoctor(token,user,imagen):Observable<any>{
    let formData=new FormData();
    
    formData.append('id_doctor',user.id_doctor)
    formData.append('nombre',user.nombre)
    formData.append('apellido',user.apellido)
    formData.append('email',user.email)
    formData.append('password',user.password)
    formData.append('role',user.role)
    formData.append('direccion',user.direccion)
    formData.append('celular',user.celular)
    formData.append('dni',user.dni)
    imagen.forEach(element => {
      formData.append('imagen[]',element)
    });
    const headers = new Headers({
      Authorization:token
    });
    return this.http.post(this.linkApi+'registrarEditDoctor',formData,{headers})
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
    return this.httpcliente.get(`https://dniruc.apisperu.com/api/v1/dni/${dni}?
    token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNtaXRoeGQxMThAZ21haWwuY29tIn0.
    24c7XETuRuTQLUqSjOH7BsKM19n6kKMOtY06qeUYX40`,{headers:headers})
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

  habilitarDoctor(token,id):Observable<any>{
    let json=JSON.stringify(id);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'habilitar',params,{headers:headers})
  }

  TraerDatosDoctor(token,id):Observable<any>{
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.get(this.linkApi+'GetDoctorId/'+id,{headers:headers})
  }


}
