import {Component, Input} from '@angular/core';
import {TwoLegArbitrageProfitOpportunityDto, TwoLegArbitrageProfitOpportunityAtDepthDto} from '../../../services/arbitrage-monitor.service';
import {ArbitrageOpportunityExchangeMarketLinkService} from "../../../services/arbitrage-opportunity-exchange-market-link.service";

@Component({
    selector: 'app-two-leg-arbitrage-opportunities-table',
    templateUrl: './two-leg-arbitrage-opportunities-table.component.html',
    styleUrls: ['./two-leg-arbitrage-opportunities-table.component.scss']
})
export class TwoLegArbitrageOpportunitiesTableComponent {
    @Input() defaultTransactionFeePercent: string;
    @Input() profitOpportunities: TwoLegArbitrageProfitOpportunityDto[];
    @Input() totalNumberOfUnfilteredOpportunities: number;
    @Input() orderBookAmountThresholdIndexSelected: number;

    constructor(private marketLinkService: ArbitrageOpportunityExchangeMarketLinkService) {
    }

    profitOpportunityAtSelectedUsdDepth(opportunity: TwoLegArbitrageProfitOpportunityDto): TwoLegArbitrageProfitOpportunityAtDepthDto {
        return opportunity.profitOpportunityHistogram[this.orderBookAmountThresholdIndexSelected];
    }

    hasBuyAtLink(profitOpportunity: TwoLegArbitrageProfitOpportunityDto): boolean {
        return this.getBuyAtLink(profitOpportunity) != null;
    }

    getBuyAtLink(profitOpportunity: TwoLegArbitrageProfitOpportunityDto) {
        return this.marketLinkService.getBuyAtLink(profitOpportunity);
    }

    hasSellAtLink(arbitrageProfit: TwoLegArbitrageProfitOpportunityDto): boolean {
        return this.getSellAtLink(arbitrageProfit) != null;
    }

    getSellAtLink(profitOpportunity: TwoLegArbitrageProfitOpportunityDto) {
        return this.marketLinkService.getSellAtLink(profitOpportunity);
    }

}
