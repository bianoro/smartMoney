import { Component, ViewChild, Input } from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common'

import { Chart } from 'chart.js';

@Component({
  selector: 'doughnut-chart',
  templateUrl: 'doughnut-chart.html'
})
export class DoughnutChartComponent {
  @Input() entries = [];
  @ViewChild('chartCanvas') chartCanvas;
  @ViewChild('chartLegend') chartLegend;

  labels = [];
  data = [];
  colors = [];

  chart: any;

  constructor() {}

  ngOnChanges() {
    console.log('Chart Categories');
    console.log(JSON.stringify(this.entries));

    const currencyPipe = new CurrencyPipe('en_US');
    const percentPipe = new PercentPipe('en_US');

    if (this.entries) {
      this.labels = this.entries.map(item => item.category_name);
      this.colors = this.entries.map(item => item.category_color);
      this.data = this.entries.map(item => item.balance);
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: this.colors,
          hoverBackgroundColor: this.colors,
          borderColor: '#34495e',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 80,
        legend: false,
        legendCallback: function(chart) {
          let legendHtml = [];
          let item = chart.data.datasets[0];

          legendHtml.push('<ul>');

          for (let i = 0; i < item.data.length; i++) {
            let value = currencyPipe.transform(item.data[i]);
            // let value = '$' + item.data[i];

            legendHtml.push('<li>');
            legendHtml.push(`<span class="chart-legend-bullet" style="color:${item.backgroundColor[i]}"></span>`);
            legendHtml.push(`<span class="chart-legend-label-text">${chart.data.labels[i]}</span>`);
            legendHtml.push(`<span class="chart-legend-label-value">${value}</span>`);
            legendHtml.push('</li>');
          }

          legendHtml.push('</ul>');

          return legendHtml.join("");
        },

        tooltips: {
          enabled: true,
          mode: 'single',
          fontSize: 14,
          fontColor: '#3b3a3e',
          fontFamily: 'Roboto',
          callbacks: {
            title: function (tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
            label: function (tooltipItem, data) {
                const amount = parseFloat(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
                const total = parseFloat(eval(data.datasets[tooltipItem.datasetIndex].data.join("+")));
                const percent = percentPipe.transform((amount / total));
                // const percent = (amount / total);

                return percent;
            },
            // footer: function(tooltipItem, data) { return 'Total: 100 planos.'; }
          }
        },

      }
    });

    this.chartLegend.nativeElement.innerHTML = this.chart.generateLegend();
  }
}

