import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfiluserService {
  linkApi = 'http://127.0.0.1:8000/api/';
  constructor(
    private httpcliente: HttpClient,
    private http: Http 
  ) { }

  EditarPerfil(token,user):Observable<any>{
    let formData=new FormData();
    formData.append('id_usuario',user.id_usuario)
    formData.append('nombre_usuario',user.nombre_usuario)
    formData.append('apellido_usuario',user.apellido_usuario)
    let headers=new HttpHeaders()
    .set('Authorization',token);
    return this.httpcliente.post(this.linkApi+'UpdatePerfil/Medico',formData,{headers:headers})
  }

  EditarFotografiaPerfil(token,id_usuario,imagen):Observable<any>{
    let formData=new FormData();
    formData.append('id_usuario',id_usuario)
    formData.append('imagen',imagen)
    let headers=new HttpHeaders()
    .set('Authorization',token);
    return this.httpcliente.post(this.linkApi+'UpdatePerfil/Medico',formData,{headers:headers})
  }
}
