import { Component, ViewChild, Input } from '@angular/core';

import { Chart } from 'chart.js';

@Component({
  selector: 'balance-panel-chart',
  templateUrl: 'balance-panel-chart.html'
})
export class BalancePanelChartComponent {
  @Input() entries = [];
  @ViewChild('chartCanvas') chartCanvas;
  labels = [];
  data = [];
  chart: any;

  constructor() {}

  ngOnChanges() {
    console.log('Chart Panel');
    console.log(JSON.stringify(this.entries));

    if (this.entries) {
      this.labels = this.entries.map(item => item.category_name);
      this.data = this.entries.map(item => item.balance);
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
				labels: this.labels,
				datasets: [{
					backgroundColor: 'rgba(41, 128, 185, 0.2)',
          borderColor: '#2573a6',
          borderWidth: 1.5,
          pointRadius: 0,
          lineTension: 0,
					data: this.data,
					fill: true,
				}]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: false,
        legend: false,
				scales: {
					xAxes: [{ display: false }],
					yAxes: [{ display: false }]
				}
			}
    });
  }
}
