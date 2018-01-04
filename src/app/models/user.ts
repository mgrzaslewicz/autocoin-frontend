import * as sha1 from 'js-sha1';
import { ExchangeKey } from "./exchange-key";

export class User {

  id: String;
  
  _userName: String;
  
  subscriptionKey: String;
  
  exchangeKeys: Array<ExchangeKey> = [];
  
  children: Array<User>;
  
  constructor() {

  }

  get userName() {
    return this._userName;
  }

  set userName(value) {
    this._userName = value;
    this.id = sha1(value);
  }

  getExchangeKeysForMarket(marketname) {
    let exchangeKeys = this.exchangeKeys.find(keys => keys.exchangeName == marketname);

    if (! exchangeKeys) {
      exchangeKeys = new ExchangeKey;
      exchangeKeys.exchangeName = marketname;

      this.exchangeKeys.push(exchangeKeys);
    }

    return exchangeKeys;
  }

}
