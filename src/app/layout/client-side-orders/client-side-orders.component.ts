import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToastService} from "../../services/toast.service";
import {CurrencyPair, stringToCurrencyPair} from "../../models";
import {ExchangeMetadataService} from "../../services/exchange-metadata.service";

@Component({
    selector: 'app-client-side-orders',
    templateUrl: './client-side-orders.component.html',
    styleUrls: ['./client-side-orders.component.scss']
})
export class ClientSideOrdersComponent implements OnInit, OnDestroy {
    currencyPairsFetchFinished: boolean = false;
    binanceApiKey: string;
    binanceSecretKey: string;
    selectedBinanceCurrencyPairString: string = null;
    selectedBinanceBaseCurrencyString: string = null;
    selectedBinanceCounterCurrencyString: string = null;
    selectedBinanceCurrencyPair: CurrencyPair = null;
    binanceCurrencyPairString: string;

    binanceAmountOfCounterCurrencyToUse: string;
    binanceCurrencyPairs: CurrencyPair[] = [];

    constructor(private exchangeMetadataService: ExchangeMetadataService, private toastService: ToastService) {
        this.binanceApiKey = localStorage.getItem('binanceApiKey');
        this.binanceSecretKey = localStorage.getItem('binanceSecretKey');
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.exchangeMetadataService.getCurrencyPairs('binance')
            .subscribe(currencyPairs => {
                this.binanceCurrencyPairs = currencyPairs;
                this.currencyPairsFetchFinished = true;
                console.log(`Displaying ${this.binanceCurrencyPairs.length} binance currency pairs`);
            });
    }

    saveBinanceKeysToLocalStorage() {
        localStorage.setItem('binanceApiKey', this.binanceApiKey);
        localStorage.setItem('binanceSecretKey', this.binanceSecretKey);
        this.toastService.success('Binance keys saved');
    }

    onChange($event) {
        this.selectedBinanceCurrencyPair = $event;
        this.selectedBinanceBaseCurrencyString = this.selectedBinanceCurrencyPair.baseCurrencyCode;
        this.selectedBinanceCounterCurrencyString = this.selectedBinanceCurrencyPair.counterCurrencyCode;
    }

    makeBinanceBuyMarketOrder() {
        console.log(`Will make binance buy market order. amount=${this.binanceAmountOfCounterCurrencyToUse}, currencyPair=${this.selectedBinanceCurrencyPair.symbol}`);
    }
}
