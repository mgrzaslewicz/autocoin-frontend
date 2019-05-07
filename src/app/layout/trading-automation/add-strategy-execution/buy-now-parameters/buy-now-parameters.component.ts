import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-buy-now-parameters',
    templateUrl: './buy-now-parameters.component.html',
    styleUrls: ['./buy-now-parameters.component.scss']
})
export class BuyNowParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        maxBuyPrice: 0.0
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

}
