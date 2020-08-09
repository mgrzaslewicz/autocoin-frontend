export function stringToCurrencyPair(currencyPair: string): CurrencyPair {
    const currencyPairArray = currencyPair.split('/');
    return new CurrencyPair(currencyPairArray[0], currencyPairArray[1]);
}

export class CurrencyPair {
    public symbol: string;

    constructor(
        public baseCurrencyCode: string | null = null,
        public counterCurrencyCode: string | null = null
    ) {
        this.symbol = `${this.baseCurrencyCode.toUpperCase()}/${this.counterCurrencyCode.toUpperCase()}`;
    }

}
