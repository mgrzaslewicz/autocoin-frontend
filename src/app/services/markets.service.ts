import { Injectable } from '@angular/core';

@Injectable()
export class MarketsService {

  constructor() { }

  get() {
    return [
      { name: 'bittrex', label: 'Bittrex' },
      { name: 'binance', label: 'Binance' }
    ];
  }

}
