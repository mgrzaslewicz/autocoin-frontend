import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-buy-now-parameters',
    templateUrl: './buy-now-parameters.component.html',
    styleUrls: ['./buy-now-parameters.component.scss']
})
export class BuyNowParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        maxBuyPrice: 0.0,
        validate: function (): String[] {
            const result = [];
            if (this.maxBuyPrice === 0) {
                result.push('Max buy price should be greater than zero');
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

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

    onMaxBuyPrice(control) {
        const value = Math.min(Math.max(control.value, 0.00000001), 9999999999);
        if (control.value && typeof value === 'number' && value !== NaN) {
            control.value = value;
            this.strategySpecificParameters.maxBuyPrice = control.value;
            this.emitInput();
        } else {
            this.strategySpecificParameters.maxBuyPrice = 0;
        }
    }

}
