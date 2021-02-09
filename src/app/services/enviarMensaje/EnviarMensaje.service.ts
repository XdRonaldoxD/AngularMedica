import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http ,Headers} from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class EnviarMensajePaciente {
  linkApi = 'http://127.0.0.1:8000/api/';
  header:Headers;
  constructor(
    private httpcliente: HttpClient,
    private http: Http 
  ) { }

  EnviarMensaje(token,datos):Observable<any>{
    let formData=new FormData();
    formData.append('tipoMensaje',datos.tipoMensaje)
    formData.append('NumeroTelefono',datos.NumeroTelefono)
    formData.append('Mensaje',datos.Mensaje)
    if (datos.tipoMensaje=="3" || datos.tipoMensaje=="2") {
      formData.append('ArchivoURL',datos.Archivo)
    }
    const headers = new Headers({
      Authorization:token
    });
    return this.http.post(this.linkApi+'Enviar/Mensaje/Whatsapp',formData,{headers})
  }

  TraerDatoPaciente(token,id):Observable<any>{
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);
    return this.httpcliente.get(this.linkApi+'TraerDatoPaciente/'+id,{headers:headers})
  }

  

}
