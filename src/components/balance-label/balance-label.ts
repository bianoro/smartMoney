import { Component, Input } from '@angular/core';

@Component({
  selector: 'balance-label',
  templateUrl: 'balance-label.html'
})
export class BalanceLabelComponent {
  @Input() currentBalance;

  constructor() { }
}

