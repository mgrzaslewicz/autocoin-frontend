import {Component, Input} from '@angular/core';
import {TwoLegArbitrageProfitDto, TwoLegArbitrageProfitOpportunityDto} from '../../../services/arbitrage-monitor.service';
import {ArbitrageOpportunityExchangeMarketLinkService} from "../../../services/arbitrage-opportunity-exchange-market-link.service";

@Component({
    selector: 'app-two-leg-arbitrage-opportunities-table',
    templateUrl: './two-leg-arbitrage-opportunities-table.component.html',
    styleUrls: ['./two-leg-arbitrage-opportunities-table.component.scss']
})
export class TwoLegArbitrageOpportunitiesTableComponent {
    @Input() profitOpportunities: TwoLegArbitrageProfitDto[];
    @Input() totalNumberOfUnfilteredOpportunities: number;
    @Input() orderBookAmountThresholdIndexSelected: number;

    constructor(private marketLinkService: ArbitrageOpportunityExchangeMarketLinkService) {
    }

    profitOpportunityAtSelectedUsdDepth(opportunity: TwoLegArbitrageProfitDto): TwoLegArbitrageProfitOpportunityDto {
        return opportunity.arbitrageProfitHistogram[this.orderBookAmountThresholdIndexSelected];
    }

    hasBuyAtLink(arbitrageProfit: TwoLegArbitrageProfitDto): boolean {
        return this.getBuyAtLink(arbitrageProfit) != null;
    }

    getBuyAtLink(arbitrageProfit: TwoLegArbitrageProfitDto) {
        return this.marketLinkService.getBuyAtLink(arbitrageProfit, this.profitOpportunityAtSelectedUsdDepth(arbitrageProfit));
    }

    hasSellAtLink(arbitrageProfit: TwoLegArbitrageProfitDto): boolean {
        return this.getSellAtLink(arbitrageProfit) != null;
    }

    getSellAtLink(arbitrageProfit: TwoLegArbitrageProfitDto) {
        return this.marketLinkService.getSellAtLink(arbitrageProfit, this.profitOpportunityAtSelectedUsdDepth(arbitrageProfit));
    }

}
