import {CurrencyPair} from './currency-pair';

export interface CancelOrderRequestDto {
    clientId: String;
    exchangeId: String;
    orderType: String;
    orderId: String;
    currencyPair: CurrencyPair;
}

export interface CancelOrderResponseDto {
    orderId: String;
    success: Boolean;
}

export interface CancelOrdersRequestDto {
    orders: CancelOrderRequestDto[];
}

export interface CancelOrdersResponseDto {
    orders: CancelOrderResponseDto[];
}

export interface OpenOrdersRequestDto {
    currencyPairs: CurrencyPair[];
}

export interface OpenOrdersResponseDto {
    failedExchanges: string[];
    openOrders: Order[];
}

export class Order {
    public viewState = 'enabled';

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
