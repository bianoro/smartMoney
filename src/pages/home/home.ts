import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AccountProvider } from '../../providers/account/account';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  entriesByDate = [];
  entriesByCategory = [];

  lastEntries = [];
  currentBalance = 0;

  constructor(
    public navCtrl: NavController,
    public account: AccountProvider) { }

  ionViewDidEnter() {
    this.loadData();
  }

  private loadData() {
    this.loadBalance();
    this.loadBalancesByDate();
    this.loadBalancesByCategory();
    this.loadLastEntries();
  }

  // Carrega o saldo atual (antes feito no contructor da classe)
  private loadBalance() {
    this.account
      .loadBalance()
        .then((balance) => this.currentBalance = balance);
  }

  loadBalancesByDate() {
    this.account.lastEntriesByDate(-7)
      .then((data: any) => this.entriesByDate = data);
  }

  private loadBalancesByCategory() {
    this.account.lastEntriesByCategory(-7)
      .then((data: any) => this.entriesByCategory = data);
  }

  // Carrega os lançamentos
  private loadLastEntries() {
    this.account
      .lastEntries(-7)
        .then((data: any) => {
          this.lastEntries = data;
        });
  }
}
