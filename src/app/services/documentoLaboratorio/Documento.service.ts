import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http ,Headers} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentoLaboratorio {
  linkApi = 'http://127.0.0.1:8000/api/';
  header:Headers;
  constructor(
    private httpcliente: HttpClient,
    private http: Http 
  ) { }

  listarDocumentoPaciente(token,id):Observable<any>{
    let headers=new HttpHeaders()
    .set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);
    return this.httpcliente.get(this.linkApi+'TraerDocumento/'+id,{headers:headers})
  }

  EliminarDocumento(token,id_paciente):Observable<any>{
    let json=JSON.stringify(id_paciente);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'Borrar/Documentos/Laboratorio',params,{headers:headers})
  }
  InsertarDocumentoLaboratorio(token,usuario_id,id_paciente,documento_name):Observable<any>{
    let formData=new FormData();
    formData.append('usuario_id',usuario_id)
    formData.append('id_paciente',id_paciente)
    formData.append('documento_name',documento_name)
    const headers = new Headers({
      Authorization:token
    });

    return this.http.post(this.linkApi+'Insert/Documentos/Laboratorio',formData,{headers})
  }

  TraerDatoPaciente(token,id):Observable<any>{
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.get(this.linkApi+'TraerDatoPaciente/'+id,{headers:headers})
  }

  

}
