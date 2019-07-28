import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-sell-higher-and-higher-specific-parameters',
    templateUrl: './sell-higher-and-higher-specific-parameters.component.html',
    styleUrls: ['./sell-higher-and-higher-specific-parameters.component.scss']
})
export class SellHigherAndHigherSpecificParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        minSellPrice: 0,
        growToSellNextRelativePercent: 0.5,
        validate: function (): String[] {
            const result = [];
            if (this.minSellPrice <= 0) {
                result.push('Min sell price should be greater than zero');
            }
            if (this.growToSellNextRelativePercent <= 0 || this.growToSellNextRelativePercent > 100) {
                result.push('Grow to sell next should be in range (0..100>');
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

    onGrowToSellNextRelativePercent(control) {
        const value = Math.min(Math.max(control.value, 0.1), 50);
        if (control.value && typeof value === 'number' && value !== NaN) {
            control.value = value;
            this.strategySpecificParameters.growToSellNextRelativePercent = value;
            this.emitInput();
        } else {
            this.strategySpecificParameters.growToSellNextRelativePercent = 0;
        }
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

}
