import {InjectionToken} from '@angular/core';

const exchangesForTrading = ['binance', 'bittrex', 'kucoin'];

export const defaultEnvironment = {
    exchangeNamesSupportedForTrading: exchangesForTrading.sort((a, b) => {
        return a.localeCompare(b);
    }),
    exchangeNamesSupportedForReadingPrices: ['bitbay', 'bitmex', 'bitstamp', 'gateio', 'kraken']
        .concat(exchangesForTrading).sort((a, b) => {
            return a.localeCompare(b);
        })
};

export const ExchangeNamesSupportedForTradingToken = new InjectionToken('ExchangeNamesSupportedForTrading');
export const ExchangeNamesSupportedForReadingPricesToken = new InjectionToken('ExchangeNamesSupportedForReadingPrices');
