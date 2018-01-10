import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchedCurrencyPairsComponent } from './watched-currency-pairs.component';

describe('WatchedCurrencyPairsComponent', () => {
  let component: WatchedCurrencyPairsComponent;
  let fixture: ComponentFixture<WatchedCurrencyPairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchedCurrencyPairsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchedCurrencyPairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
