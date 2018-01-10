import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WatchCurrencyPairsService } from '../../../services/watch-currency-pairs.service';
import { CurrencyPair } from '../../../models/currency-pair';

class SymbolParser {
  static parse(string) {
    string = string.toUpperCase();

    let regex = /([A-Z]+)\/([A-Z]+)/g;
    let pairs = [];

    let pairSymbol;
    while (pairSymbol = regex.exec(string)) {
      pairs.push(new CurrencyPair(pairSymbol[1], pairSymbol[2]));
    }

    return pairs;
  }

  static validate(formControl: FormControl) {
    let value: string = formControl.value 
      ? formControl.value.replace(/\s+/g, '').toUpperCase()
      : '';

    let pairs = SymbolParser.parse(value);
    if (pairs.length == 0) {
      return { symbol: true };
    }

    return null;
  }
}

@Component({
  selector: 'app-watched-currency-pairs',
  templateUrl: './watched-currency-pairs.component.html',
  styleUrls: ['./watched-currency-pairs.component.scss']
})
export class WatchedCurrencyPairsComponent implements OnInit {

  public pairSymbol: string;

  public pairSymbolControl: FormControl;

  constructor(
    private watchedCurrencyPairs: WatchCurrencyPairsService
  ) { }

  ngOnInit() {
    this.pairSymbolControl = new FormControl('test', [
      Validators.required,
      SymbolParser.validate
    ]);
  }

  allPairs() {
    return this.watchedCurrencyPairs.all();
  }

  onAdd() {
    if (this.pairSymbolControl.invalid) {
      return;
    }

    let pairs = SymbolParser.parse(this.pairSymbol);

    for (let pair of pairs) {
      if (! this.watchedCurrencyPairs.has(pair)) {
        this.watchedCurrencyPairs.push(pair);
      }
    }

    this.pairSymbol = '';
  }

  removePair(pair) {
    this.watchedCurrencyPairs.remove(pair);
  }

  removeAll() {
    this.watchedCurrencyPairs.removeAll();
  }

}
