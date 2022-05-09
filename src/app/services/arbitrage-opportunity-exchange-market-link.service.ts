import {Injectable} from '@angular/core';
import {ExchangeMarketLink} from "./exchange-market-link.service";
import {TwoLegArbitrageProfitOpportunityDto} from "./arbitrage-monitor.service";

@Injectable()
export class ArbitrageOpportunityExchangeMarketLinkService {

    constructor(private exchangeMarketLink: ExchangeMarketLink) {
    }

    hasBuyAtLink(profitOpportunity: TwoLegArbitrageProfitOpportunityDto): boolean {
        return this.getBuyAtLink(profitOpportunity) != null;
    }

    getBuyAtLink(profitOpportunity: TwoLegArbitrageProfitOpportunityDto) {
        return this.exchangeMarketLink.getExchangeMarketLink(profitOpportunity.buyAtExchange, profitOpportunity.baseCurrency, profitOpportunity.counterCurrency);
    }

    hasSellAtLink(profitOpportunity: TwoLegArbitrageProfitOpportunityDto): boolean {
        return this.getSellAtLink(profitOpportunity) != null;
    }

    getSellAtLink(profitOpportunity: TwoLegArbitrageProfitOpportunityDto) {
        return this.exchangeMarketLink.getExchangeMarketLink(profitOpportunity.sellAtExchange, profitOpportunity.baseCurrency, profitOpportunity.counterCurrency);
    }
}
