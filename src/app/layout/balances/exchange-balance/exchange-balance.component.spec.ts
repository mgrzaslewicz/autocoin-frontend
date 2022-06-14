import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeBalanceComponent } from './exchange-balance.component';

describe('WalletsComponent', () => {
  let component: ExchangeBalanceComponent;
  let fixture: ComponentFixture<ExchangeBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
