import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-sell-when-second-currency-grows-specific-parameters',
    templateUrl: './sell-when-second-currency-grows-parameters.component.html',
    styleUrls: ['./sell-when-second-currency-grows-parameters.component.scss']
})
export class SellWhenSecondCurrencyGrowsParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        pricesTriggeringSale: '',
        secondCurrencyPairToWatch: ''
    };

    @Output('specificParametersChanged')
    specificParametersChangedEmitter = new EventEmitter;

    constructor() {
    }

    ngOnInit() {
        this.emitInput();
    }

    onPricesTriggeringSale(control) {
        if (control.value) {
            this.strategySpecificParameters.pricesTriggeringSale = control.value;
            this.emitInput();
        }
    }

    onSecondCurrencyPairToWatch(control) {
        if (control.value) {
            this.strategySpecificParameters.secondCurrencyPairToWatch = control.value;
            this.emitInput();
        }
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

}
