import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BalancePanelComponent } from './balance-panel/balance-panel';
import { EntrySummaryComponent } from './entry-summary/entry-summary';
import { EntryListComponent } from './entry-list/entry-list';
import { BalanceLabelComponent } from './balance-label/balance-label';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart';
import { BalancePanelChartComponent } from './balance-panel-chart/balance-panel-chart';

@NgModule({
	declarations: [
    BalancePanelComponent,
    EntrySummaryComponent,
    EntryListComponent,
    BalanceLabelComponent,
    DoughnutChartComponent,
    BalancePanelChartComponent
  ],
	imports: [
    IonicPageModule
  ],
	exports: [
    BalancePanelComponent,
    EntrySummaryComponent,
    EntryListComponent,
    BalanceLabelComponent,
    DoughnutChartComponent,
    BalancePanelChartComponent
  ]
})
export class ComponentsModule {}
