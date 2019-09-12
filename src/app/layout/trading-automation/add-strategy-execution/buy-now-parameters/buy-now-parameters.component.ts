import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-buy-now-parameters',
    templateUrl: './buy-now-parameters.component.html',
    styleUrls: ['./buy-now-parameters.component.scss']
})
export class BuyNowParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        maxBuyPrice: '',
        isDecimal: this.isDecimal,
        validate: function (): String[] {
            const result = [];
            if (!this.isDecimal(this.maxBuyPrice, 8)) {
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

    isDecimal(value: string, decimalPlaces: number): boolean {
        const regexpString = `^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,${decimalPlaces}})?\$`;
        return new RegExp(regexpString).test(value);
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

    onMaxBuyPrice(control) {
        this.strategySpecificParameters.maxBuyPrice = control.value;
        this.emitInput();
    }

}
