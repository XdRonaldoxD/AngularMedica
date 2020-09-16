import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
@Component({
  selector: 'app-grafica-dona',
  templateUrl: './grafica-dona.component.html',
  styles: []
})
export class GraficaDonaComponent implements OnInit {
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  @Input('ChartLabels') pieChartLabels: Label[] = [];
  @Input('ChartData') pieChartData: SingleDataSet = [];
  @Input('ChartType') pieChartType: ChartType = 'pie';

  constructor() { 

  }

  ngOnInit() {
  }

}
