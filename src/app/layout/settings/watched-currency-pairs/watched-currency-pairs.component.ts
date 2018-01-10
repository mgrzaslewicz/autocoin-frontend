import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WatchCurrencyPairsService } from '../../../services/watch-currency-pairs.service';
import { CurrencyPair } from '../../../models/currency-pair';

class SymbolValidator {
  static symbol(formControl: FormControl) {
    let value: string = formControl.value 
      ? formControl.value.replace(/\s+/g, '').toUpperCase()
      : '';

    if (! value.match(/[A-Z]+\/[A-Z]+/)) {
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
      SymbolValidator.symbol
    ]);
  }

  allPairs() {
    return this.watchedCurrencyPairs.all();
  }

  onAdd() {
    if (this.pairSymbolControl.invalid) {
      return;
    }

    let pair = this.parseCurrencyPair(this.pairSymbol);

    if (! this.watchedCurrencyPairs.has(pair)) {
      this.watchedCurrencyPairs.push(pair);
    }

    this.pairSymbol = '';
  }

  parseCurrencyPair(symbol: string): CurrencyPair {
    let symbolArray = symbol.toUpperCase().replace(/\s+/g, '').split('/');
    
    return new CurrencyPair(symbolArray[0], symbolArray[1]);
  }

  removePair(pair) {
    this.watchedCurrencyPairs.remove(pair);
  }

}
