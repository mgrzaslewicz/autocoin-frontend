import {Injectable} from '@angular/core';

@Injectable()
export class ExchangeMarketLink {
    private exchangeLinks: Map<string, string> = new Map<string, string>([
        ['binance', 'https://www.binance.com/en/trade/{BASE}_{COUNTER}'],
        ['bitbay', 'https://app.bitbay.net/market/{BASE}-{COUNTER}'],
        ['bitstamp', 'https://www.bitstamp.net/market/tradeview/'],
        ['bittrex', 'https://global.bittrex.com/Market/Index?MarketName={COUNTER}-{BASE}'],
        ['gateio', 'https://www.gate.io/trade/{BASE}_{COUNTER}'],
        ['kraken', 'https://trade.kraken.com/markets/kraken/{BASE}/{COUNTER}'],
        ['kucoin', ' https://trade.kucoin.com/spot/{BASE}-{COUNTER}']
    ]);

    constructor() {
    }

    getExchangeMarketLink(exchangeName: string, baseCurrency: string, counterCurrency: string): string | null {
        const key = exchangeName.toLowerCase();
        if (this.exchangeLinks.has(key)) {
            return this.exchangeLinks.get(key)
                .replace('{BASE}', baseCurrency)
                .replace('{COUNTER}', counterCurrency);
        } else {
            return null;
        }
    }

}
