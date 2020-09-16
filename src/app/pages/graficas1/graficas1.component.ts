import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas1.component.html',
  styleUrls: ['./graficas1.component.css']
})
export class Graficas1Component implements OnInit {


  grafico:any={
    'graficos':{
      'labels':['Con frijoles','Con Natalia','Con tocio'],
      'data':[24,30,46],
      'type':'pie',
      'leyenda':'El pan se come con'
    },
    'graficos2':{
      'labels':['Hombre','Mujeres'],
      'data':[4500,6000],
      'type':'pie',
      'leyenda':'Entrevistas'
    },
    'graficos3':{
      'labels':['Si', 'NO'],
      'data':[95,5],
      'type':'pie',
      'leyenda':'¿Le dan gases los frejoels?'
    },
    'graficos4':{
      'labels':['Si','No','Talves'],
      'data':[30,40,50],
      'type':'pie',
      'leyenda':'¿Esta bueno el trabajo?'
    }
  }

  constructor() {
    
   }

  ngOnInit() {
  }

}
