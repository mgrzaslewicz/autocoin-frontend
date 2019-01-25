import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-health-panel',
    templateUrl: './health-panel.component.html',
    styleUrls: ['./health-panel.component.scss'],
    animations: [
        trigger('myAnimation', [
            state('in', style({
                height: '*',
                overflow: 'hidden'
            })),
            state('out', style({
                height: '0',
                overflow: 'hidden'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})
export class HealthPanelComponent implements OnInit {
    @Input() healthy: boolean;
    @Input() exchange: string;
    @Input() details: Map<String, Boolean>;

    showDetails = false;
    slide = 'out';

    constructor() {}

    ngOnInit() {}

    toggle() {
        this.slide = this.slide === 'in' ? 'out' : 'in';
    }
}
