import {Injectable} from '@angular/core';

@Injectable()
export class ExchangeMarketLink {
    private exchangeLinks: Map<string, string> = new Map<string, string>([
        ['bibox', 'https://www.bibox.com/zh/exchange/basic/{BASE}_{COUNTER}'],
        ['binance', 'https://www.binance.com/en/trade/{BASE}_{COUNTER}'],
        ['bitbay', 'https://app.bitbay.net/market/{BASE}-{COUNTER}'],
        ['bitfinex', 'https://trading.bitfinex.com/t/{BASE}:{COUNTER}?type=exchange'],
        ['bitmex', 'https://www.bitmex.com/spot/{BASE}_{COUNTER}'],
        ['bitstamp', 'https://www.bitstamp.net/markets/{base}/{counter}/'],
        ['bittrex', 'https://global.bittrex.com/Market/Index?MarketName={COUNTER}-{BASE}'],
        ['bleutrade', 'https://bleutrade.com/exchange/{BASE}/{COUNTER}'],
        ['cexio', 'https://cex.io/#{BASE}-{COUNTER}'],
        ['coinbasepro', 'https://pro.coinbase.com/trade/{BASE}-{COUNTER}'],
        ['coindeal', 'https://pro.coindeal.com/{BASE}-{COUNTER}'],
        ['exmo', 'https://exmo.com/en/trade#?pair={BASE}_{COUNTER}'],
        ['gateio', 'https://www.gate.io/trade/{BASE}_{COUNTER}'],
        ['gemini', 'https://exchange.gemini.com/trade/{BASE}{COUNTER}'],
        ['ftx', 'https://ftx.com/trade/{BASE}/{COUNTER}'],
        ['hitbtc', 'https://hitbtc.com/{base}-to-{counter}'],
        ['kraken', 'https://trade.kraken.com/markets/kraken/{BASE}/{COUNTER}'],
        ['kucoin', 'https://trade.kucoin.com/spot/{BASE}-{COUNTER}'],
        ['okex', 'https://www.okx.com/trade-spot/{BASE}-{COUNTER}'],
        ['poloniex', 'https://poloniex.com/exchange#{COUNTER}_{BASE}'],
        ['yobit', 'https://yobit.net/en/trade/{BASE}/{COUNTER}']
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
                .replace('{COUNTER}', counterCurrency)
                .replace('{base}', baseCurrency.toLowerCase())
                .replace('{counter}', counterCurrency.toLowerCase())
                ;
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
