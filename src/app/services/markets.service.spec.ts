import { TestBed, inject } from '@angular/core/testing';

import { MarketsService } from './markets.service';

describe('MarketsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketsService]
    });
  });

  it('should be created', inject([MarketsService], (service: MarketsService) => {
    expect(service).toBeTruthy();
  }));
});
