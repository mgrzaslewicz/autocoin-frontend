import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-buy-now-parameters',
    templateUrl: './buy-now-parameters.component.html',
    styleUrls: ['./buy-now-parameters.component.scss']
})
export class BuyNowParametersComponent implements OnInit {

    @Input()
    strategySpecificParameters = {};

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

}
