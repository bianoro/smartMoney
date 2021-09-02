import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewEntryPage } from '../../pages/new-entry/new-entry';

@Component({
  selector: 'balance-panel',
  templateUrl: 'balance-panel.html'
})
export class BalancePanelComponent {
  @Input() currentBalance: number;
  @Input() entries = [];

  constructor(public navCtrl: NavController) { }

  addEntry() {
    this.navCtrl.push(NewEntryPage);
  }
}
