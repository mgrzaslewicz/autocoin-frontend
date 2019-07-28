import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-buy-lower-and-lower-specific-parameters',
    templateUrl: './buy-lower-and-lower-specific-parameters.component.html',
    styleUrls: ['./buy-lower-and-lower-specific-parameters.component.scss']
})
export class BuyLowerAndLowerSpecificParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        maxBuyPrice: 0.0,
        dropToBuyNextRelativePercent: 0.5,
        validate: function (): String[] {
            const result = [];
            if (this.maxBuyPrice <= 0) {
                result.push('Max buy price should be greater than zero');
            }
            if (this.dropToBuyNextRelativePercent <= 0 || this.dropToBuyNextRelativePercent > 100) {
                result.push('Drop to buy next should be in range (0..100>');
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

    onMaxBuyPrice(control) {
        const value = Math.min(Math.max(control.value, 0.00000001), 9999999999);
        if (control.value && typeof value === 'number' && value !== NaN) {
            control.value = value;
            this.strategySpecificParameters.maxBuyPrice = value;
            this.emitInput();
        } else {
            this.strategySpecificParameters.maxBuyPrice = 0;
        }
    }

    onDropToBuyNextRelativePercent(control) {
        const value = Math.min(Math.max(control.value, 0.1), 50);
        if (control.value && typeof value === 'number' && value !== NaN) {
            control.value = value;
            this.strategySpecificParameters.dropToBuyNextRelativePercent = value;
            this.emitInput();
        } else {
            this.strategySpecificParameters.dropToBuyNextRelativePercent = 0;
        }
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

}
