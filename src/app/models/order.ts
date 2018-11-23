import {CurrencyPair} from './currency-pair';

export interface CancelOrderRequestDto {
    exchangeUserId: String;
    exchangeId: String;
    orderType: String;
    orderId: String;
    currencyPair: CurrencyPair;
}

export interface CancelOrderResponseDto {
    orderId: string;
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
    exchangeName: string;
    exchangeUserId: string;
    errorMessage?: string;
    openOrders: Order[];
}

export interface Order {
    exchangeUserId: String;
    exchangeId: String;
    exchangeName: String;
    orderId: string;
    baseCurrencyCode: String;
    counterCurrencyCode: String;
    orderType: String;
    orderStatus: String;
    orderedAmount: Number;
    filledAmount: Number;
    price: Number;
    timestamp: Number;
}
