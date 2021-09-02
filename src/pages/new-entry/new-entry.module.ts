import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from "../../components/components.module";
import { CurrencyMaskModule } from "ng2-currency-mask";

import { NewEntryPage } from './new-entry';

@NgModule({
  declarations: [
    NewEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(NewEntryPage),
    ComponentsModule,
    CurrencyMaskModule
  ],
})
export class NewEntryPageModule {}
