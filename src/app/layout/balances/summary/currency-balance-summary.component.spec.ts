import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CurrencyBalanceSummaryComponent} from './currency-balance-summary.component';

describe('BalanceAnalyticsComponent', () => {
    let component: CurrencyBalanceSummaryComponent;
    let fixture: ComponentFixture<CurrencyBalanceSummaryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CurrencyBalanceSummaryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CurrencyBalanceSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
