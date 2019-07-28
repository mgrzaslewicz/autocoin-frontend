import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-sell-now-parameters',
    templateUrl: './sell-now-parameters.component.html',
    styleUrls: ['./sell-now-parameters.component.scss']
})
export class SellNowParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        minSellPrice: 0,
        validate: function (): String[] {
            const result = [];
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

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
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

}
