import {Component, Input} from '@angular/core';
import {TwoLegArbitrageProfit} from '../../../services/arbitrage-monitor.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-two-leg-arbitrage-profit-tile',
    templateUrl: './two-leg-arbitrage-profit-tile.component.html',
    styleUrls: ['./two-leg-arbitrage-profit-tile.component.scss'],
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
export class TwoLegArbitrageProfitTileComponent {
    @Input() twoLegArbitrageProfitOpportunity: TwoLegArbitrageProfit;

    showDetails = false;
    slide = 'out';

    constructor() {
    }

    toggleDetailsVisibility() {
        this.showDetails = !this.showDetails;
        this.slide = this.slide === 'in' ? 'out' : 'in';
    }

}
