import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ExchangeHealthDto} from '../../../services/health.service';

@Component({
    selector: 'app-health-panel',
    templateUrl: './exchange-health-tile.component.html',
    styleUrls: ['./exchange-health-tile.component.scss'],
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
            transition('in => out', animate('100ms ease-in-out')),
            transition('out => in', animate('100ms ease-in-out'))
        ])
    ]
})
export class ExchangeHealthTileComponent implements OnInit {
    @Input() exchangeHealth: ExchangeHealthDto;

    showDetails = false;
    slide = 'out';

    constructor() {
    }

    ngOnInit() {
    }

    getTileBackgroundColorBasedOnHealth(): string {
        if (this.exchangeHealth.healthy) {
            return 'success';
        } else if (this.exchangeHealth.canGetPublicMarketData) {
            return 'info';
        } else {
            return 'danger';
        }
    }

    toggleDetailsVisibility() {
        this.showDetails = !this.showDetails;
        this.slide = this.slide === 'in' ? 'out' : 'in';
    }
}
