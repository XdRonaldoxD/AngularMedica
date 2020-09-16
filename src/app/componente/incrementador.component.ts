import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {
//REFRENCIA al HTML DEL CAMPO QUE DESEAMOS MODIFICAR
  @ViewChildren('txtprogrees') txtprogrees:ElementRef;
  //recibir componente entra padre e hijo con input
  @Input('nombre') leyenda:string='Leyenda';
  @Input()  progreso:number=50;

  //CAMBIO DE EVENTO DEL PROGRESO
  @Output() cambioValor:EventEmitter<number> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    console.log('leyenda',this.leyenda);
    console.log('progreso',this.progreso);
  }

  onchanges(newValue:number){
 
    // let evento:any=document.getElementsByName("progreso")[0];
    console.log(this.txtprogrees);
    if (newValue>=100) {
      this.progreso=100;
    }else if (newValue <=0) {
      this.progreso=0;
    }else{
      this.progreso=newValue;
    }
    // evento.value=Number(this.progreso)
    this.txtprogrees.nativeElement.value=this.progreso;
    this.cambioValor.emit(this.progreso);


    
  }



  cambiarvalor(valor:number){
    
    this.progreso=this.progreso+valor; 

    //EMITIRE EL VALOR NUMERO QUE TENGA EL PROGRESO
    this.cambioValor.emit(this.progreso);

    if (this.progreso>=100 && this.progreso>0) {
      this.progreso=100;
      return;
    }
    if (this.progreso<=0 && this.progreso<0) {
      this.progreso=0;
      return;
    }

  }

}
