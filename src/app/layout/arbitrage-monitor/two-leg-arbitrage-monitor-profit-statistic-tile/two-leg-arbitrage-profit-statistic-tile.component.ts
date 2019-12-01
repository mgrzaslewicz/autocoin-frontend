import {Component, Input, OnInit} from '@angular/core';
import {ProfitOpportunityCount, TwoLegArbitrageProfitStatistic} from '../../../services/arbitrage-monitor.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ExchangeMarketLink} from '../../../services/exchange-market-link.service';
import {DomSanitizer} from '@angular/platform-browser';

interface ProfitOpportunityCountChartBar {
    profitPercentThreshold: number;
    count: number;
    heightPercent: number;
}

@Component({
    selector: 'app-two-leg-arbitrage-profit-statistic-tile',
    templateUrl: './two-leg-arbitrage-profit-statistic-tile.component.html',
    styleUrls: ['./two-leg-arbitrage-profit-statistic-tile.component.scss'],
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
export class TwoLegArbitrageProfitStatisticTileComponent implements OnInit {
    @Input() twoLegArbitrageProfitStatistic: TwoLegArbitrageProfitStatistic;

    showDetails = false;
    slide = 'out';
    firstExchangeLink: string = null;
    secondExchangeLink: string = null;

    constructor(private exchangeMarketLink: ExchangeMarketLink,
                private sanitizer: DomSanitizer) {
    }

    toggleDetailsVisibility() {
        this.showDetails = !this.showDetails;
        this.slide = this.slide === 'in' ? 'out' : 'in';
    }


    toChartBar(profitOpportunityCountList: ProfitOpportunityCount[]): ProfitOpportunityCountChartBar[] {
        let sum = 0;
        profitOpportunityCountList.forEach(item => {
            sum += item.count;
        });
        sum /= 100;
        return profitOpportunityCountList.map(item => {
            return {
                count: item.count,
                profitPercentThreshold: item.profitPercentThreshold,
                heightPercent: item.count / sum
            };
        });
    }

    private getFirstExchangeLink() {
        return this.exchangeMarketLink.getExchangeMarketLink(this.twoLegArbitrageProfitStatistic.firstExchange, this.twoLegArbitrageProfitStatistic.baseCurrency, this.twoLegArbitrageProfitStatistic.counterCurrency);
    }

    private getSecondExchangeLink() {
        return this.exchangeMarketLink.getExchangeMarketLink(this.twoLegArbitrageProfitStatistic.secondExchange, this.twoLegArbitrageProfitStatistic.baseCurrency, this.twoLegArbitrageProfitStatistic.counterCurrency);
    }

    ngOnInit(): void {
        this.firstExchangeLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.getFirstExchangeLink()) as string;
        this.secondExchangeLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.getSecondExchangeLink()) as string;
    }

}
