export class CurrencyPair {

  constructor(
    public entryCurrencyCode: String|null = null, 
    public exitCurrencyCode: String|null = null
  ) {}

  symbol() {
    return `${this.entryCurrencyCode}/${this.exitCurrencyCode}`;
  }

}
