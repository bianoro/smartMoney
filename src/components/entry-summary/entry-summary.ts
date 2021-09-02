import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ReportPage } from '../../pages/report/report';

@Component({
  selector: 'entry-summary',
  templateUrl: 'entry-summary.html'
})
export class EntrySummaryComponent {
  @Input() entries = [];
  @Input() showActions = false;

  constructor(public navCtrl: NavController) { }

  showReport() {
    this.navCtrl.push(ReportPage);
  }
}
