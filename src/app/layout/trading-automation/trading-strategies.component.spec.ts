import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TradingStrategiesComponent} from './trading-strategies.component';

describe('TradingStrategiesComponent', () => {
    let component: TradingStrategiesComponent;
    let fixture: ComponentFixture<TradingStrategiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TradingStrategiesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TradingStrategiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
