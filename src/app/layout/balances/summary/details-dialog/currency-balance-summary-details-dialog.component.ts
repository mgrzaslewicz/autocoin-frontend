import {Component, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BlockchainWalletCurrencySummaryDto, CurrencyBalanceSummaryDto, ExchangeCurrencySummaryDto} from "../../../../services/balance-monitor.service";

@Component({
    selector: 'app-currency-summary-details-dialog',
    templateUrl: './currency-balance-summary-details-dialog.component.html',
    styleUrls: ['./currency-balance-summary-details-dialog.component.scss']
})
export class CurrencyBalanceSummaryDetailsDialog implements OnDestroy {

    private currencySummaryDetails: CurrencyBalanceSummaryDto;

    @ViewChild('content', {static: true})
    content;

    @Output('refresh')
    refreshEmmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private modalService: NgbModal,
    ) {
    }

    ngOnDestroy(): void {
    }

    showCurrencySummaryDetails(currencySummaryDetails: CurrencyBalanceSummaryDto) {
        this.currencySummaryDetails = currencySummaryDetails;
        this.modalService.open(this.content);
    }

    getTotalWalletsBalance(): number {
        return this.currencySummaryDetails.wallets
            .map(it => Number(it.balance))
            .reduce((acc, val) => acc + val);
    }

    getTotalWalletsUsdValue(): number {
        return this.currencySummaryDetails.wallets
            .map(it => Number(it.valueInOtherCurrency['USD']))
            .reduce((acc, val) => acc + val);
    }

    getTotalExchangesBalance(): number {
        return this.currencySummaryDetails.exchanges
            .map(it => Number(it.balance))
            .reduce((acc, val) => acc + val);
    }

    getTotalExchangesUsdValue(): number {
        return this.currencySummaryDetails.exchanges
            .map(it => Number(it.valueInOtherCurrency['USD']))
            .reduce((acc, val) => acc + val);
    }

    getWalletUsdBalance(wallet: BlockchainWalletCurrencySummaryDto): number {
        return Number(wallet.valueInOtherCurrency['USD']);
    }

    getExchangeUsdBalance(exchange: ExchangeCurrencySummaryDto): number {
        return Number(exchange.valueInOtherCurrency['USD']);
    }

}
