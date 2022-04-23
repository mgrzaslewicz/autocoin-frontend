import {Component, Input} from '@angular/core';
import {TwoLegArbitrageProfitDto} from '../../../services/arbitrage-monitor.service';
import {ExchangeMarketLink} from '../../../services/exchange-market-link.service';

@Component({
    selector: 'app-two-leg-arbitrage-opportunities-table',
    templateUrl: './two-leg-arbitrage-opportunities-table.component.html',
    styleUrls: ['./two-leg-arbitrage-opportunities-table.component.scss']
})
export class TwoLegArbitrageOpportunitiesTableComponent {
    @Input() profitOpportunities: TwoLegArbitrageProfitDto[];
    @Input() totalNumberOfUnfilteredOpportunities: number;
    @Input() orderBookAmountThresholdIndexSelected: number;

    private exchangeLinkCache: Map<String, String> = new Map<String, String>();

    constructor(private exchangeMarketLink: ExchangeMarketLink) {
    }

    hasBuyAtLink(arbitrageProfit: TwoLegArbitrageProfitDto): boolean {
        return this.getBuyAtLink(arbitrageProfit) != null;
    }

    getBuyAtLink(arbitrageProfit: TwoLegArbitrageProfitDto) {
        const profitOpportunity = arbitrageProfit.arbitrageProfitHistogram[this.orderBookAmountThresholdIndexSelected];
        const cacheKey = profitOpportunity.buyAtExchange
            + '-' + arbitrageProfit.baseCurrency
            + '-' + arbitrageProfit.counterCurrency;
        if (!this.exchangeLinkCache.has(cacheKey)) {
            const link = this.exchangeMarketLink.getExchangeMarketLink(profitOpportunity.buyAtExchange, arbitrageProfit.baseCurrency, arbitrageProfit.counterCurrency);
            this.exchangeLinkCache.set(cacheKey, link);
        }
        return this.exchangeLinkCache.get(cacheKey);
    }

    hasSellAtLink(arbitrageProfit: TwoLegArbitrageProfitDto): boolean {
        return this.getSellAtLink(arbitrageProfit) != null;
    }

    getSellAtLink(arbitrageProfit: TwoLegArbitrageProfitDto) {
        const profitOpportunity = arbitrageProfit.arbitrageProfitHistogram[this.orderBookAmountThresholdIndexSelected];
        const cacheKey = profitOpportunity.sellAtExchange
            + '-' + arbitrageProfit.baseCurrency
            + '-' + arbitrageProfit.counterCurrency;
        if (!this.exchangeLinkCache.has(cacheKey)) {
            const link = this.exchangeMarketLink.getExchangeMarketLink(profitOpportunity.sellAtExchange, arbitrageProfit.baseCurrency, arbitrageProfit.counterCurrency);
            this.exchangeLinkCache.set(cacheKey, link);
        }
        return this.exchangeLinkCache.get(cacheKey);
    }

    getVolumeAtBuyExchange(profitOpportunity: TwoLegArbitrageProfitDto): number {
        if (profitOpportunity.arbitrageProfitHistogram[this.orderBookAmountThresholdIndexSelected].buyAtExchange === profitOpportunity.firstExchange) {
            return profitOpportunity.usd24hVolumeAtFirstExchange;
        } else {
            return profitOpportunity.usd24hVolumeAtSecondExchange;
        }
    }

    getVolumeAtSellExchange(profitOpportunity: TwoLegArbitrageProfitDto): number {
        if (profitOpportunity.arbitrageProfitHistogram[this.orderBookAmountThresholdIndexSelected].sellAtExchange === profitOpportunity.firstExchange) {
            return profitOpportunity.usd24hVolumeAtFirstExchange;
        } else {
            return profitOpportunity.usd24hVolumeAtSecondExchange;
        }
    }
}
