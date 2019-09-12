import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-buy-lower-and-lower-specific-parameters',
    templateUrl: './buy-lower-and-lower-specific-parameters.component.html',
    styleUrls: ['./buy-lower-and-lower-specific-parameters.component.scss']
})
export class BuyLowerAndLowerSpecificParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters: any = {
        maxBuyPrice: '',
        dropToBuyNextRelativePercent: 0.5,
        isDecimal: this.isDecimal,
        validate: function (): String[] {
            const result = [];
            if (!this.isDecimal(this.maxBuyPrice, 8)) {
                result.push('Max buy price should be greater than zero');
            }
            if (!this.isDecimal(this.dropToBuyNextRelativePercent, 2) || Number(this.dropToBuyNextRelativePercent) > 100) {
                result.push('Drop to buy next should be in range (0..100>');
            }
            return result;
        }
    };

    isDecimal(value: string, decimalPlaces: number): boolean {
        const regexpString = `^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,${decimalPlaces}})?\$`;
        return new RegExp(regexpString).test(value);
    }

    @Output('specificParametersChanged')
    specificParametersChangedEmitter = new EventEmitter;

    constructor() {
    }

    ngOnInit() {
        this.emitInput();
    }

    onMaxBuyPrice(control) {
        this.strategySpecificParameters.maxBuyPrice = control.value;
        this.emitInput();
    }

    onDropToBuyNextRelativePercent(control) {
        this.strategySpecificParameters.dropToBuyNextRelativePercent = control.value;
        this.emitInput();
    }

    emitInput() {
        this.specificParametersChangedEmitter.emit(this.strategySpecificParameters);
    }

}
