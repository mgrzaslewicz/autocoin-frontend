import { TestBed, inject } from '@angular/core/testing';
import {ExchangeUsersService} from './exchange-users.service';


describe('ExchangeUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExchangeUsersService]
    });
  });

  it('should be created', inject([ExchangeUsersService], (service: ExchangeUsersService) => {
    expect(service).toBeTruthy();
  }));
});
