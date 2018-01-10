import { TestBed, inject } from '@angular/core/testing';

import { WatchCurrencyPairsService } from './watch-currency-pairs.service';

describe('WatchCurrencyPairsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WatchCurrencyPairsService]
    });
  });

  it('should be created', inject([WatchCurrencyPairsService], (service: WatchCurrencyPairsService) => {
    expect(service).toBeTruthy();
  }));
});
