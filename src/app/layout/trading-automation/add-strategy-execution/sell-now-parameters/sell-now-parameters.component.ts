import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-sell-now-parameters',
    templateUrl: './sell-now-parameters.component.html',
    styleUrls: ['./sell-now-parameters.component.scss']
})
export class SellNowParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {
        minSellPrice: '',
        isDecimal: this.isDecimal,
        validate: function (): String[] {
            const result = [];
            if (!this.isDecimal(this.minSellPrice, 8)) {
                result.push('Min sell price should be greater than zero');
            }
            return result;
        }
    };

    @Output('specificParametersChanged')
    specificParametersChangedEmitter = new EventEmitter;

    constructor() {
    }

    isDecimal(value: string, decimalPlaces: number): boolean {
        const regexpString = `^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,${decimalPlaces}})?\\s*$`;
        return new RegExp(regexpString).test(value);
    }

    ngOnInit() {
        this.emitInput();
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

    onMinSellPrice(control) {
        this.strategySpecificParameters.minSellPrice = control.value;
        this.emitInput();
    }

}
