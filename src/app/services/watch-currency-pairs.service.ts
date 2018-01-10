import { Injectable } from '@angular/core';
import { CurrencyPair } from '../models/currency-pair';
import * as _ from 'underscore';

@Injectable()
export class WatchCurrencyPairsService {

  private pairs: Array<CurrencyPair> = [];

  constructor() {
    this.localLoad();
  }

  has(pair: CurrencyPair) {
    return this.pairs.find(existingPair => {
      return existingPair.entryCurrencyCode === pair.entryCurrencyCode
        && existingPair.exitCurrencyCode == pair.exitCurrencyCode;
    }) !== undefined;
  }

  push(pair: CurrencyPair) {
    this.pairs.push(pair);

    this.localStore();
  }

  remove(pair: CurrencyPair) {
    let index = this.pairs.indexOf(pair);
    this.pairs.splice(index, 1);

    this.localStore();
  }

  removeAll() {
    this.pairs = [];

    this.localStore();
  }

  all(): Array<CurrencyPair> {
    return this.pairs;
  }

  private localStore() {
    localStorage.setItem('currency-watched-pairs', JSON.stringify(this.pairs));
  }

  private localLoad() {
    let json = localStorage.getItem('currency-watched-pairs');

    if (json) {
      json = JSON.parse(json);
      for (let data of json) {
        let pair = new CurrencyPair;

        pair = _.extend(pair, data)

        this.pairs.push(pair);
      }
    }
  }

}
