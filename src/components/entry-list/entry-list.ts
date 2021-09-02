import { Component, Input } from '@angular/core';
import { NavController, Form } from 'ionic-angular';

import { NewEntryPage } from '../../pages/new-entry/new-entry';
import { ReportPage } from '../../pages/report/report';


@Component({
  selector: 'entry-list',
  templateUrl: 'entry-list.html'
})
export class EntryListComponent {
  @Input() entries = [];

  constructor(public navCtrl: NavController) { }

  editEntry(entry) {
    console.log('entry-list: opening entry - ', JSON.stringify(entry));
    this.navCtrl.push(NewEntryPage, {entryId: entry.id });
  }

  showReport() {
    this.navCtrl.push(ReportPage);
  }
}
