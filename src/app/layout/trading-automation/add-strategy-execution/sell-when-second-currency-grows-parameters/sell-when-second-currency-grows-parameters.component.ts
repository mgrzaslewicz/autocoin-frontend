import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-sell-when-second-currency-grows-specific-parameters',
    templateUrl: './sell-when-second-currency-grows-parameters.component.html',
    styleUrls: ['./sell-when-second-currency-grows-parameters.component.scss']
})
export class SellWhenSecondCurrencyGrowsParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        secondCurrencyPricesTriggeringSale: '',
        secondCurrencyPairToWatch: '',
        minSellPrice: '',
        isDecimal: this.isDecimal,
        validate: function (): String[] {
            const result = [];
            // valid is  eg '1004.5 , 4,55.444444,      5565656, 3543534.33333'
            if (!/^(\d+(\.\d+){0,1})((\ )*,(\ )*(\d+(\.\d+){0,1}))*$/.test(this.secondCurrencyPricesTriggeringSale)) {
                result.push('Provide valid prices, eg. 4500, 5000.5, 5050.00067');
            }
            // 'ABC/BCD,aa/dbbd,  X/y  , asdfkj/ksjY' --> not used, but regex is /^([a-zA-Z]+\/[a-zA-Z]+)((\ )*,(\ )*([a-zA-Z]+\/[a-zA-Z]+))*/
            // valid is eg 'ABC/BCd'
            if (!/^([a-zA-Z]+\/[a-zA-Z]+)$/.test(this.secondCurrencyPairToWatch)) {
                result.push('Provide valid second currency pair, eg ABC/BCD');
            }
            if (!this.isDecimal(this.minSellPrice, 8)) {
                result.push('Min sell price should be greater than zero');
            }
            return result;
        }
    };

    isDecimal(value: string, decimalPlaces: number): boolean {
        const regexpString = `^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,${decimalPlaces}})?\\s*$`;
        return new RegExp(regexpString).test(value);
    }

    @Output('specificParametersChanged')
    specificParametersChangedEmitter = new EventEmitter;

    constructor() {
    }

    ngOnInit() {
        this.emitInput();
    }

    onSecondCurrencyPricesTriggeringSale(control) {
        this.strategySpecificParameters.secondCurrencyPricesTriggeringSale = control.value;
        this.emitInput();
    }

    onSecondCurrencyPairToWatch(control) {
        this.strategySpecificParameters.secondCurrencyPairToWatch = control.value;
        this.emitInput();
    }

    onMinSellPrice(control) {
        this.strategySpecificParameters.minSellPrice = control.value;
        this.emitInput();
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

}
