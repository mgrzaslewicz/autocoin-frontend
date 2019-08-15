import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-sell-higher-and-higher-specific-parameters',
    templateUrl: './sell-higher-and-higher-specific-parameters.component.html',
    styleUrls: ['./sell-higher-and-higher-specific-parameters.component.scss']
})
export class SellHigherAndHigherSpecificParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        minSellPrice: '',
        growToSellNextRelativePercent: 0.5,
        isDecimal: this.isDecimal,
        validate: function (): String[] {
            const result = [];
            if (!this.isDecimal(this.minSellPrice, 8)) {
                result.push('Min sell price should be greater than zero');
            }
            if (!this.isDecimal(this.growToSellNextRelativePercent, 2) || Number(this.growToSellNextRelativePercent) > 100) {
                result.push('Grow to sell next should be in range (0..100>');
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

    onMinSellPrice(control) {
        this.strategySpecificParameters.minSellPrice = control.value;
        this.emitInput();
    }

    onGrowToSellNextRelativePercent(control) {
        this.strategySpecificParameters.growToSellNextRelativePercent = control.value;
        this.emitInput();
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

}
