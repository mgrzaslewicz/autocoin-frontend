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
    clientId: String;
    exchangeName: String;
    exchangeId: String;
    orderId: String;
    entryCurrencyCode: String;
    exitCurrencyCode: String;
    orderType: String;
    orderStatus: String;
    orderedAmount: Number;
    filledAmount: Number;
    price: Number;
    timestamp: Number;

    constructor(userId: String, exchangeName: String, orderId: String, entryCurrencyCode: String, exitCurrencyCode: String, orderType: String, orderStatus: String, orderedAmount: Number, filledAmount: Number, price: Number, timestamp: Number) {
        this.clientId = userId;
        this.exchangeName = exchangeName;
        this.orderId = orderId;
        this.entryCurrencyCode = entryCurrencyCode;
        this.exitCurrencyCode = exitCurrencyCode;
        this.orderType = orderType;
        this.orderStatus = orderStatus;
        this.orderedAmount = orderedAmount;
        this.filledAmount = filledAmount;
        this.price = price;
        this.timestamp = timestamp;
    }

    currencyPair(): CurrencyPair {
        return new CurrencyPair(this.entryCurrencyCode, this.exitCurrencyCode);
    }

    currencyPairSymbol(): string {
        return `${this.entryCurrencyCode}/${this.exitCurrencyCode}`;
    }

}
