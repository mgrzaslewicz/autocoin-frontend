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

    onMinSellPrice(control) {
        if (control.value) {
            this.strategySpecificParameters.minSellPrice = control.value;
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
