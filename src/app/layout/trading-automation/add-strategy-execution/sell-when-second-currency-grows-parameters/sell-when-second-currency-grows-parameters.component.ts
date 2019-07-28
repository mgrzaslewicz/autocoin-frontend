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
        minSellPrice: 0,
        validate: function (): String[] {
            const result = [];
            // valid is  eg '1004.5 , 4,55.444444,      5565656, 3543534.33333'
            if (!/^(\d+(\.\d+){0,1})((\ )*,(\ )*(\d+(\.\d+){0,1}))*$/.test(this.pricesTriggeringSale)) {
                result.push('Provide valid prices triggering sales, eg 100, 105.00003, 110.9');
            }
            // 'ABC/BCD,aa/dbbd,  X/y  , asdfkj/ksjY' --> not used, but regex is /^([a-zA-Z]+\/[a-zA-Z]+)((\ )*,(\ )*([a-zA-Z]+\/[a-zA-Z]+))*/
            // valid is eg 'ABC/BCd'
            if (!/^([a-zA-Z]+\/[a-zA-Z]+)$/.test(this.secondCurrencyPairToWatch)) {
                result.push('Provide valid second currency pair, eg ABC/BCD');
            }
            if (this.minSellPrice <= 0) {
                result.push('Min sell price should be greater than zero');
            }
            return result;
        }
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

    onMinSellPrice(control) {
        const value = Math.min(Math.max(control.value, 0.00000001), 9999999999);
        if (control.value && typeof value === 'number' && value !== NaN) {
            control.value = value;
            this.strategySpecificParameters.minSellPrice = value;
            this.emitInput();
        } else {
            this.strategySpecificParameters.minSellPrice = 0;
        }
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

}
