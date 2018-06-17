export class CurrencyPair {

    constructor(
        public baseCurrencyCode: String | null = null,
        public counterCurrencyCode: String | null = null
    ) {
    }

    symbol() {
        return `${this.baseCurrencyCode.toUpperCase()}/${this.counterCurrencyCode.toUpperCase()}`;
    }

}
