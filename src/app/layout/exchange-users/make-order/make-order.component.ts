import {Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CurrencyPair} from '../../../models';
import {Observable} from 'rxjs';
import {WatchCurrencyPairsService} from '../../../services/watch-currency-pairs.service';
import {ToastService} from '../../../services/toast.service';
import {ExchangeNameWithExchangeUser} from '../exchange-users.component';

@Component({
    selector: 'app-make-order',
    templateUrl: './make-order.component.html',
    styleUrls: ['./make-order.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MakeOrderComponent implements OnInit {

    @ViewChild('makeOrderContent')
    makeOrderContentModal;

    @ViewChild('confirmOrderContent')
    confirmOrderContentModal;

    @ViewChild('makeOrderForm')
    makeOrderForm;

    private makeOrderModal: NgbModalRef;

    public selectedExchangeWithExchangeUsers;

    public orderType: string = 'buy';

    public exchangePair: string;

    public allExchangePairs: CurrencyPair[];

    public walletPercentage = 25;

    @Output('success')
    successEmitter = new EventEmitter;

    constructor(
        private modalService: NgbModal,
        private watchedCurrencyPairs: WatchCurrencyPairsService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.allExchangePairs = this.watchedCurrencyPairs.all();
    }

    generateFor(selectedExchangeNamesWithExchangeUsers: ExchangeNameWithExchangeUser[]) {
        this.selectedExchangeWithExchangeUsers = selectedExchangeNamesWithExchangeUsers;

        this.makeOrderModal = this.modalService.open(this.makeOrderContentModal, {windowClass: 'make-order-modal', keyboard: false});
    }

    searchExchangePair = (text$: Observable<string>) => {
        return text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(exchangePairSymbol => exchangePairSymbol.toUpperCase())
            .map(exchangePairSymbol => {
                return this.allExchangePairs.filter(pair => pair.symbol().indexOf(exchangePairSymbol) > -1).slice(0, 10);
            })
            .map(pairs => pairs.map(pair => pair.symbol()));
    };

    onWalletPercentageChanges(control) {
        if (control.value) {
            this.walletPercentage = control.value = Math.min(Math.max(control.value, 1), 100);
        }
    }

    showConfirmOrder() {
        this.modalService.open(this.confirmOrderContentModal, {windowClass: 'confirm-order-modal'}).result.then(result => {

            this.makeOrderModal.close();
            this.toastService.success('Orders has been placed correctly.');
            this.successEmitter.emit();
        }, () => {
        });
    }

    get baseCurrency() {
        return this.exchangePair.split('/')[0];
    }

    get counterCurrency() {
        return this.exchangePair.split('/')[1];
    }

}
