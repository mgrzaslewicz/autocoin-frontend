import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TwoLegArbitrageProfitOpportunityAtDepthDto, TwoLegArbitrageProfitOpportunityDto} from "../../../../services/arbitrage-monitor.service";
import {ArbitrageOpportunityExchangeMarketLinkService} from "../../../../services/arbitrage-opportunity-exchange-market-link.service";

@Component({
    selector: 'app-two-leg-arbitrage-opportunity-dialog',
    templateUrl: './two-leg-arbitrage-opportunity-dialog.html',
    styleUrls: ['./two-leg-arbitrage-opportunity-dialog.scss']
})
export class TwoLegArbitrageOpportunityDialog implements OnInit {

    private opportunity: TwoLegArbitrageProfitOpportunityDto;
    private defaultTransactionFeePercent: string;
    private opportunityAtSelectedDepth: TwoLegArbitrageProfitOpportunityAtDepthDto;

    @ViewChild('content', {static: true})
    content;

    @Output('refresh')
    refreshEmmitter: EventEmitter<any> = new EventEmitter();
    proVersionEncouragement = 'Full details available in Pro version';

    constructor(
        private modalService: NgbModal,
        private marketLinkService: ArbitrageOpportunityExchangeMarketLinkService
    ) {
    }

    ngOnInit() {
    }

    showOpportunityDetails(opportunity: TwoLegArbitrageProfitOpportunityDto, opportunityAtSelectedDepth: TwoLegArbitrageProfitOpportunityAtDepthDto, defaultTransactionFeePercent: string) {
        this.opportunity = opportunity;
        this.opportunityAtSelectedDepth = opportunityAtSelectedDepth;
        this.defaultTransactionFeePercent = defaultTransactionFeePercent;

        this.modalService.open(this.content);
    }

    someTransactionFeesHaveDefaultValue(): boolean {
        return this.opportunityAtSelectedDepth.fees.isDefaultBuyFeeUsed ||
            this.opportunityAtSelectedDepth.fees.isDefaultSellFeeUsed
    }

    isTransferFeeUnavailable(): boolean {
        return this.opportunityAtSelectedDepth.fees.withdrawalFee == null;
    }

    isVolumeNotAvailableForBothExchanges(): boolean {
        return this.opportunity.usd24hVolumeAtBuyExchange == null || (!this.opportunity.areDetailsHidden && this.opportunity.sellAtExchange == null);
    }

    isVolumeAvailableForBothExchanges(): boolean {
        return this.opportunity.usd24hVolumeAtBuyExchange != null && (this.opportunity.areDetailsHidden || this.opportunity.sellAtExchange != null);
    }

    hasBuyAtLink(): boolean {
        return this.getBuyAtLink() != null;
    }

    getBuyAtLink() {
        return this.marketLinkService.getBuyAtLink(this.opportunity);
    }

    hasSellAtLink(): boolean {
        return this.getSellAtLink() != null;
    }

    getSellAtLink() {
        return this.marketLinkService.getSellAtLink(this.opportunity);
    }
}
