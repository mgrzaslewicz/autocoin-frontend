import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeHealthTileComponent } from './health-panel.component';

describe('HealthPanelComponent', () => {
    let component: ExchangeHealthTileComponent;
    let fixture: ComponentFixture<ExchangeHealthTileComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [ExchangeHealthTileComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ExchangeHealthTileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
