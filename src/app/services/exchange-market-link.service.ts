import {Injectable} from '@angular/core';

@Injectable()
export class ExchangeMarketLink {
    private exchangeLinks: Map<string, string> = new Map<string, string>([
        ['bibox', 'https://www.bibox.com/zh/exchange/basic/{BASE}_{COUNTER}'],
        ['binance', 'https://www.binance.com/en/trade/{BASE}_{COUNTER}'],
        ['bitbay', 'https://app.bitbay.net/market/{BASE}-{COUNTER}'],
        ['bitstamp', 'https://www.bitstamp.net/market/tradeview/'],
        ['bittrex', 'https://global.bittrex.com/Market/Index?MarketName={COUNTER}-{BASE}'],
        ['bleutrade', 'https://bleutrade.com/exchange/{BASE}/{COUNTER}'],
        ['cexio', 'https://cex.io/#{BASE}-{COUNTER}'],
        ['coinbasepro', 'https://pro.coinbase.com/trade/{BASE}-{COUNTER}'],
        ['coindeal', 'https://pro.coindeal.com/{BASE}-{COUNTER}'],
        ['exmo', 'https://exmo.com/en/trade#?pair={BASE}_{COUNTER}'],
        ['gateio', 'https://www.gate.io/trade/{BASE}_{COUNTER}'],
        ['gemini', 'https://gemini.com'],
        ['hitbtc', 'https://hitbtc.com/{BASE}-to-{COUNTER}'],
        ['kraken', 'https://trade.kraken.com/markets/kraken/{BASE}/{COUNTER}'],
        ['kucoin', 'https://trade.kucoin.com/spot/{BASE}-{COUNTER}'],
        ['livecoin', 'https://www.livecoin.net/en/trading/{BASE}_{COUNTER}'],
        ['poloniex', 'https://poloniex.com/exchange#{COUNTER}_{BASE}']
    ]);

    private exchangeLinkCache: Map<string, string> = new Map<string, string>();

    constructor() {
    }

    getExchangeMarketLink(exchangeName: string, baseCurrency: string, counterCurrency: string): string | null {
        return this.getCachedExchangeMarketLink(exchangeName, baseCurrency, counterCurrency);
    }

    private calculateExchangeMarketLink(exchangeName: string, baseCurrency: string, counterCurrency: string): string | null {
        const exchangeLinkKey = exchangeName.toLowerCase();
        if (this.exchangeLinks.has(exchangeLinkKey)) {
            return this.exchangeLinks.get(exchangeLinkKey)
                .replace('{BASE}', baseCurrency)
                .replace('{COUNTER}', counterCurrency);
        } else {
            return null;
        }
    }

    private getCachedExchangeMarketLink(exchangeName: string, baseCurrency: string, counterCurrency: string): string | null {
        const cacheKey = exchangeName + '-' + baseCurrency + '-' + counterCurrency;
        if (!this.exchangeLinkCache.has(cacheKey)) {
            const link = this.calculateExchangeMarketLink(exchangeName, baseCurrency, counterCurrency);
            this.exchangeLinkCache.set(cacheKey, link);
        }
        return this.exchangeLinkCache.get(cacheKey);
    }

}
