import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http ,Headers} from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class HistoriapacienteService {
  linkApi = 'http://127.0.0.1:8000/api/';
  header:Headers;
  constructor(
    private httpcliente: HttpClient,
    private http: Http 
  ) { }
  

  EliminarTratamientoPaciente(token,id_paciente):Observable<any>{
    let json=JSON.stringify(id_paciente);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'TratamientoPaciente/Eliminar',params,{headers:headers})
  }

  listarHistoriaPaciente(token):Observable<any>{
    let headers=new HttpHeaders()
    .set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);
    return this.httpcliente.get(this.linkApi+'PacienteHistoria/listado',{headers:headers})
  }
  listarHistoriaPacienteDeshabilitado(token):Observable<any>{
    let headers=new HttpHeaders()
    .set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);
    return this.httpcliente.get(this.linkApi+'PacienteHistoria/listado/Deshabilitado',{headers:headers})
  }

  DniExistentePaciente(token,dni):Observable<any>{
    let json=JSON.stringify(dni);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'DniExistentePaciente',params,{headers:headers})
  }

  DeshabilitarPaciente(token,id):Observable<any>{
    let json=JSON.stringify(id);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'DeshabilitarPaciente',params,{headers:headers})
  }

  habilitarPaciente(token,id):Observable<any>{
    let json=JSON.stringify(id);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'habilitarPaciente',params,{headers:headers})
  }

  InsertarPaciente(token,datos,imagen):Observable<any>{
    let formData=new FormData();
    formData.append('id_paciente',datos.id_paciente)
    formData.append('id_user',datos.id_user)
    formData.append('NumeroCitaMedica',datos.NumeroCitaMedica)
    formData.append('Imagen',datos.Imagen)
    formData.append('NombrePaciente',datos.NombrePaciente)
    formData.append('ApellidoPaciente',datos.ApellidoPaciente)
    formData.append('SexoPaciente',datos.SexoPaciente)
    formData.append('Dni',datos.Dni)
    formData.append('FechaNaciemto',datos.FechaNaciemto)
    formData.append('Edad',datos.Edad)
    formData.append('Direccion',datos.Direccion)
    formData.append('Celular',datos.Celular)
    formData.append('Celular',datos.Celular)
    formData.append('Whatsapp',datos.Whatsapp)
    formData.append('Correo',datos.Correo)
    formData.append('NombreFacebook',datos.NombreFacebook)
    formData.append('Formacontactar',datos.Formacontactar)
    formData.append('MotivoConsulta',datos.MotivoConsulta)
    formData.append('GP',datos.GP)
    formData.append('FUR',datos.FUR)
    formData.append('PAP',datos.PAP)
    formData.append('MAC',datos.MAC)
    formData.append('RAM',datos.RAM)
    formData.append('AntecendesPersonales',datos.AntecendesPersonales)
    formData.append('AntecendesFamiliares',datos.AntecendesFamiliares)
    formData.append('PA',datos.PA)
    formData.append('T',datos.T) 
    formData.append('FC',datos.FC)
    formData.append('FR',datos.FR)
    formData.append('Peso',datos.Peso)
    formData.append('Talla',datos.Talla)
    formData.append('ComentarioExamenClinico',datos.ComentarioExamenClinico)
    formData.append('documentoLabotario',datos.documentoLabotario)
    formData.append('diagnostico',datos.diagnostico)
    formData.append('imageneologia',datos.imageneologia)
    formData.append('proximacita',datos.proximacita)
    formData.append('tratamiento',datos.tratamiento)
    imagen.forEach(element => {
      formData.append('imagen[]',element)
    });
    const headers = new Headers({
      Authorization:token
    });

    return this.http.post(this.linkApi+'InsertarPaciente',formData,{headers})
  }

  TraerDatoPaciente(token,id):Observable<any>{
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.get(this.linkApi+'TraerPaciente/'+id,{headers:headers})
  }

  
  AlmacenarDatoPaciente(token,id):Observable<any>{
    let json=JSON.stringify(id);
    let params='json='+json;
    let headers=new HttpHeaders().
    set('Content-Type','application/x-www-form-urlencoded')
    .set('Authorization',token);

    return this.httpcliente.post(this.linkApi+'AlmacenarPaciente',params,{headers:headers})
  }

  TraerDatosGraficos(token,datos):Observable<any>{
    let params=new FormData();
    params.append('fechaIncio',datos.fechaIncio)
    params.append('FechaFin',datos.FechaFin)
    const headers = new Headers({
      Authorization:token
    });

    return this.http.post(this.linkApi+'listado/Paciente',params,{headers})
  }

}
