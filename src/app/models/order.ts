import {CurrencyPair} from './currency-pair';

export interface CancelOrderRequestDto {
    clientId: String;
    exchangeId: String;
    orderId: String;
    currencyPair: CurrencyPair;
}

export interface OpenOrdersRequestDto {
    currencyPairs: CurrencyPair[];
}

export class Order {
    constructor(
        public clientId: String,
        public exchangeId: String,
        public exchangeName: String,
        public orderId: String,
        public entryCurrencyCode: String,
        public exitCurrencyCode: String,
        public orderType: String,
        public orderStatus: String,
        public orderedAmount: Number,
        public filledAmount: Number,
        public price: Number,
        public timestamp: Number
    ) {

    }

    currencyPair(): CurrencyPair {
        return new CurrencyPair(this.entryCurrencyCode, this.exitCurrencyCode);
    }

    currencyPairSymbol(): string {
        return `${this.entryCurrencyCode}/${this.exitCurrencyCode}`;
    }

}
