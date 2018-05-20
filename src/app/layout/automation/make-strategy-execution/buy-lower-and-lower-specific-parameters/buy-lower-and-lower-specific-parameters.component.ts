import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-buy-lower-and-lower-specific-parameters',
  templateUrl: './buy-lower-and-lower-specific-parameters.component.html',
  styleUrls: ['./buy-lower-and-lower-specific-parameters.component.scss']
})
export class BuyLowerAndLowerSpecificParametersComponent implements OnInit {

  @Input()
  strategySpecificParameters = {
    maxBuyPrice: 0,
    dropToBuyNextRelativePercent: 50
  };

  @Output('speciticParametersChanged')
  speciticParametersChangedEmmiter = new EventEmitter;

  constructor() { }

  ngOnInit() {
    this.emitInput();
  }

  onMaxBuyPrice(control) {
    if (control.value) {
      this.strategySpecificParameters.maxBuyPrice = control.value;
      this.emitInput();
    }
  }

  onDropToBuyNextRelativePercent(control) {
    if (control.value) {
      control.value = Math.min(Math.max(control.value, 0.1), 50);
      this.strategySpecificParameters.dropToBuyNextRelativePercent = control.value;
      this.emitInput();
    }
  }

  emitInput() {
    this.speciticParametersChangedEmmiter.emit(this.strategySpecificParameters);
  }

}
