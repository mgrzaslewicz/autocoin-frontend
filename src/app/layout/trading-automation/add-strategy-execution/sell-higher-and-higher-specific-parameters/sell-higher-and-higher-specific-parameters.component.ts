import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-sell-higher-and-higher-specific-parameters',
    templateUrl: './sell-higher-and-higher-specific-parameters.component.html',
    styleUrls: ['./sell-higher-and-higher-specific-parameters.component.scss']
})
export class SellHigherAndHigherSpecificParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        minSellPrice: 0,
        growToSellNextRelativePercent: 0.5
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

    onMinSellPrice(control) {
        if (control.value) {
            const value = Math.min(Math.max(control.value, 0.00000001), 9999999999);
            const precision = this.precision(value);
            control.value = Number(value).toFixed(precision);
            this.strategySpecificParameters.minSellPrice = Number(control.value);
            this.emitInput();
        }
    }

    onGrowToSellNextRelativePercent(control) {
        if (control.value) {
            control.value = Math.min(Math.max(control.value, 0.1), 50);
            this.strategySpecificParameters.growToSellNextRelativePercent = control.value;
            this.emitInput();
        }
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

}
