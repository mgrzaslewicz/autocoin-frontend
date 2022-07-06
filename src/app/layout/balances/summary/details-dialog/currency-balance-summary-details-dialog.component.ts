import {Component, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CurrencyBalanceSummaryDto, HasBalance, HasValueInOtherCurrency} from "../../../../services/balance-monitor.service";

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

    getTotalBalance(items: HasBalance[]): number {
        return items
            .map(it => Number(it.balance))
            .reduce((acc, val) => acc + val);
    }

    getTotalUsdValue(items: HasValueInOtherCurrency[]): number {
        return items
            .map(it => Number(it.valueInOtherCurrency['USD']))
            .reduce((acc, val) => acc + val);
    }

    getUsdBalance(item: HasValueInOtherCurrency): number {
        return Number(item.valueInOtherCurrency['USD']);
    }

}
