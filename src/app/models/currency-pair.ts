export class CurrencyPair {

  constructor(
    public entryCurrencyCode: String|null = null, 
    public exitCurrencyCode: String|null = null
  ) {}

  symbol() {
    return `${this.entryCurrencyCode.toUpperCase()}/${this.exitCurrencyCode.toUpperCase()}`;
  }

}
