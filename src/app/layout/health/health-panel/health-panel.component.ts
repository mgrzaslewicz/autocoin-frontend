import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ExchangeHealth} from '../health.component';

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
        ])
    ]
})
export class HealthPanelComponent implements OnInit {
    @Input() exchangeHealth: ExchangeHealth;

    showDetails = false;
    slide = 'out';

    constructor() {
    }

    ngOnInit() {
    }

    toggleDetailsVisibility() {
        this.showDetails = !this.showDetails;
        this.slide = this.slide === 'in' ? 'out' : 'in';
    }
}
