import {InjectionToken} from '@angular/core';

const exchangesForTrading = [
    'binance',
    'bittrex',
    'kucoin'
];

export const defaultEnvironment = {
    exchangeNamesSupportedForTrading: exchangesForTrading.sort((a, b) => {
        return a.localeCompare(b);
    }),
    exchangeNamesSupportedForGettingPublicMarketData: [
        'bibox',
        'bitbay',
        'bitmex',
        'bitstamp',
        'coinbasepro',
        'gateio',
        'gemini',
        'kraken'
    ]
        .concat(exchangesForTrading).sort((a, b) => {
            return a.localeCompare(b);
        })
};

export const ExchangeNamesSupportedForTradingToken = new InjectionToken('ExchangeNamesSupportedForTrading');
export const ExchangeNamesSupportedForGettingPublicMarketData = new InjectionToken('ExchangeNamesSupportedForGettingPublicMarketData');
