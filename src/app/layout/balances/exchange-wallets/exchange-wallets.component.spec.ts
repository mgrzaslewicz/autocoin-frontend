import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeWalletsComponent } from './exchange-wallets.component';

describe('WalletsComponent', () => {
  let component: ExchangeWalletsComponent;
  let fixture: ComponentFixture<ExchangeWalletsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeWalletsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeWalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
