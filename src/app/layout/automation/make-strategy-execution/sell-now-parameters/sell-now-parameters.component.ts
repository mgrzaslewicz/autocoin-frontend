import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-sell-now-parameters',
    templateUrl: './sell-now-parameters.component.html',
    styleUrls: ['./sell-now-parameters.component.scss']
})
export class SellNowParametersComponent implements OnInit {

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
