import {Component, Input, OnInit} from '@angular/core';
import {TwoLegArbitrageProfit} from '../../../services/arbitrage-monitor.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ExchangeMarketLink} from '../../../services/exchange-market-link.service';

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
export class TwoLegArbitrageProfitTileComponent implements OnInit {
    @Input() twoLegArbitrageProfitOpportunity: TwoLegArbitrageProfit;

    showDetails = false;
    slide = 'out';
    buyAtLink: string = null;
    sellAtLink: string = null;

    constructor(private exchangeMarketLink: ExchangeMarketLink) {
    }

    toggleDetailsVisibility() {
        this.showDetails = !this.showDetails;
        this.slide = this.slide === 'in' ? 'out' : 'in';
    }

    private getBuyAtLink() {
        return this.exchangeMarketLink.getExchangeMarketLink(this.twoLegArbitrageProfitOpportunity.buyAtExchange, this.twoLegArbitrageProfitOpportunity.baseCurrency, this.twoLegArbitrageProfitOpportunity.counterCurrency);
    }

    private getSellAtLink() {
        return this.exchangeMarketLink.getExchangeMarketLink(this.twoLegArbitrageProfitOpportunity.sellAtExchange, this.twoLegArbitrageProfitOpportunity.baseCurrency, this.twoLegArbitrageProfitOpportunity.counterCurrency);
    }

    ngOnInit(): void {
        this.buyAtLink = this.getBuyAtLink();
        this.sellAtLink = this.getSellAtLink();
    }

}
