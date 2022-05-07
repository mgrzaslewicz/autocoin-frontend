import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TwoLegArbitrageProfitDto, TwoLegArbitrageProfitOpportunityDto} from "../../../../services/arbitrage-monitor.service";
import {ArbitrageOpportunityExchangeMarketLinkService} from "../../../../services/arbitrage-opportunity-exchange-market-link.service";

@Component({
    selector: 'app-two-leg-arbitrage-opportunity-dialog',
    templateUrl: './two-leg-arbitrage-opportunity-dialog.html',
    styleUrls: ['./two-leg-arbitrage-opportunity-dialog.scss']
})
export class TwoLegArbitrageOpportunityDialog implements OnInit {

    private opportunity: TwoLegArbitrageProfitDto;
    private opportunityAtSelectedDepth: TwoLegArbitrageProfitOpportunityDto;

    @ViewChild('content', {static: true})
    content;

    @Output('refresh')
    refreshEmmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private modalService: NgbModal,
        private marketLinkService: ArbitrageOpportunityExchangeMarketLinkService
    ) {
    }

    ngOnInit() {
    }

    showOpportunityDetails(opportunity: TwoLegArbitrageProfitDto, opportunityAtSelectedDepth: TwoLegArbitrageProfitOpportunityDto) {
        this.opportunity = opportunity;
        this.opportunityAtSelectedDepth = opportunityAtSelectedDepth;

        this.modalService.open(this.content);
    }

    getVolumeAtBuyExchange(): number {
        if (this.opportunityAtSelectedDepth.buyAtExchange === this.opportunity.firstExchange) {
            return this.opportunity.usd24hVolumeAtFirstExchange;
        } else {
            return this.opportunity.usd24hVolumeAtSecondExchange;
        }
    }

    getVolumeAtSellExchange(): number {
        if (this.opportunityAtSelectedDepth.sellAtExchange === this.opportunity.firstExchange) {
            return this.opportunity.usd24hVolumeAtFirstExchange;
        } else {
            return this.opportunity.usd24hVolumeAtSecondExchange;
        }
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
        return this.marketLinkService.getBuyAtLink(this.opportunity, this.opportunityAtSelectedDepth);
    }

    hasSellAtLink(): boolean {
        return this.getSellAtLink() != null;
    }

    getSellAtLink() {
        return this.marketLinkService.getSellAtLink(this.opportunity, this.opportunityAtSelectedDepth);
    }
}
