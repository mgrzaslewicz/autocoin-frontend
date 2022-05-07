import {Injectable} from '@angular/core';
import {ExchangeMarketLink} from "./exchange-market-link.service";
import {TwoLegArbitrageProfitDto, TwoLegArbitrageProfitOpportunityDto} from "./arbitrage-monitor.service";

@Injectable()
export class ArbitrageOpportunityExchangeMarketLinkService {

    constructor(private exchangeMarketLink: ExchangeMarketLink) {
    }

    hasBuyAtLink(profitOpportunity: TwoLegArbitrageProfitDto, profitAtSelectedUsdDepth: TwoLegArbitrageProfitOpportunityDto): boolean {
        return this.getBuyAtLink(profitOpportunity, profitAtSelectedUsdDepth) != null;
    }

    getBuyAtLink(profitOpportunity: TwoLegArbitrageProfitDto, profitAtSelectedUsdDepth: TwoLegArbitrageProfitOpportunityDto) {
        return this.exchangeMarketLink.getExchangeMarketLink(profitAtSelectedUsdDepth.buyAtExchange, profitOpportunity.baseCurrency, profitOpportunity.counterCurrency);
    }

    hasSellAtLink(profitOpportunity: TwoLegArbitrageProfitDto, profitAtSelectedUsdDepth: TwoLegArbitrageProfitOpportunityDto): boolean {
        return this.getSellAtLink(profitOpportunity, profitAtSelectedUsdDepth) != null;
    }

    getSellAtLink(profitOpportunity: TwoLegArbitrageProfitDto, profitAtSelectedUsdDepth: TwoLegArbitrageProfitOpportunityDto) {
        return this.exchangeMarketLink.getExchangeMarketLink(profitAtSelectedUsdDepth.sellAtExchange, profitOpportunity.baseCurrency, profitOpportunity.counterCurrency);
    }
}
