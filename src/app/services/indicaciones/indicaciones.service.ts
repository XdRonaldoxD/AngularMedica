import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http ,Headers} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class IndicacionesMedicas {
  linkApi = 'http://127.0.0.1:8000/api/';
  // header:Headers;
  constructor(
    private httpcliente: HttpClient,
    private http: Http 
  ) { }

  listarIndicacionesPaciente(token,id):Observable<any>{
    let headers=new HttpHeaders()
    .set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);
    return this.httpcliente.get(this.linkApi+'Mostrar/Indicaciones/Medicas/'+id,{headers:headers})
  }

  VaciarIndicicaciones(token,id_paciente):Observable<any>{
    let json=JSON.stringify(id_paciente);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'Eliminar/Indicaciones',params,{headers:headers})
  }

  AlmacenarIndicicaciones(token,id_paciente):Observable<any>{
    let json=JSON.stringify(id_paciente);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'Almacenar/Indicaciones',params,{headers:headers})
  }

  InsertarIndicaciones(token,datos):Observable<any>{
    let json=JSON.stringify(datos);
    console.log(json);
    let formData=new FormData();
    formData.append('formingerir',datos.formingerir)
    formData.append('medicamento',datos.medicamento)
    formData.append('cantidad',datos.cantidad)
    formData.append('hclinip',datos.hclinip)
    formData.append('usuario_id',datos.usuario_id)
    formData.append('dias',datos.dias)

    const headers = new Headers({
      Authorization:token
    });

    return this.http.post(this.linkApi+'Insert/IndicacionesDoctor/Medicas',formData,{headers})
  }

  TraerDatoPaciente(token,id):Observable<any>{
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.get(this.linkApi+'TraerPaciente/'+id,{headers:headers})
  }

}
