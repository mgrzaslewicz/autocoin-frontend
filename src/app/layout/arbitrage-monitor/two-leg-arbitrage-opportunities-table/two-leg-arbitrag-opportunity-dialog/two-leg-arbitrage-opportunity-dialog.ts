import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TwoLegArbitrageProfitOpportunityDto, TwoLegArbitrageProfitOpportunityAtDepthDto} from "../../../../services/arbitrage-monitor.service";
import {ArbitrageOpportunityExchangeMarketLinkService} from "../../../../services/arbitrage-opportunity-exchange-market-link.service";

@Component({
    selector: 'app-two-leg-arbitrage-opportunity-dialog',
    templateUrl: './two-leg-arbitrage-opportunity-dialog.html',
    styleUrls: ['./two-leg-arbitrage-opportunity-dialog.scss']
})
export class TwoLegArbitrageOpportunityDialog implements OnInit {

    private opportunity: TwoLegArbitrageProfitOpportunityDto;
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

    showOpportunityDetails(opportunity: TwoLegArbitrageProfitOpportunityDto, opportunityAtSelectedDepth: TwoLegArbitrageProfitOpportunityAtDepthDto) {
        this.opportunity = opportunity;
        this.opportunityAtSelectedDepth = opportunityAtSelectedDepth;

        this.modalService.open(this.content);
    }

    areSomeOrAllFeesUnavailable(): boolean {
        return this.opportunityAtSelectedDepth.fees.buyFee == null ||
            this.opportunityAtSelectedDepth.fees.withdrawalFee == null ||
            this.opportunityAtSelectedDepth.fees.sellFee == null
    }

    isTransferFeeUnavailable(): boolean {
        return this.opportunityAtSelectedDepth.fees.withdrawalFee == null;
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
