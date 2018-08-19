import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-buy-lower-and-lower-specific-parameters',
    templateUrl: './buy-lower-and-lower-specific-parameters.component.html',
    styleUrls: ['./buy-lower-and-lower-specific-parameters.component.scss']
})
export class BuyLowerAndLowerSpecificParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        maxBuyPrice: 0.0,
        dropToBuyNextRelativePercent: 0.5
    };

    @Output('specificParametersChanged')
    specificParametersChangedEmitter = new EventEmitter;

    constructor() {
    }

    ngOnInit() {
        this.emitInput();
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

    onMaxBuyPrice(control) {
        if (control.value) {
            const value = Math.min(Math.max(control.value, 0.00000001), 9999999999);
            const precision = this.precision(value);
            control.value = Number(value).toFixed(precision);
            this.strategySpecificParameters.maxBuyPrice = Number(control.value); // no idea why control.value has string type at this point so create number
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
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

}
