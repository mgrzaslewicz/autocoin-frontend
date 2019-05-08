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
        secondCurrencyPairToWatch: '',
        minSellPrice: 0
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

    private precision(a) {
        if (!isFinite(a)) {
            return 0;
        }
        let e = 1, p = 0;
        while (Math.round(a * e) / e !== a) {
            e *= 10;
            p++;
        }
        return p;
    }

    onMinSellPrice(control) {
        if (control.value) {
            const value = Math.min(Math.max(control.value, 0.00000001), 9999999999);
            const precision = this.precision(value);
            control.value = Number(value).toFixed(precision);
            this.strategySpecificParameters.minSellPrice = Number(control.value);
            this.emitInput();
        }
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

}
