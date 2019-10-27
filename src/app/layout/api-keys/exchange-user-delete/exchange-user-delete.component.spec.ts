import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ExchangeUserDeleteComponent} from './exchange-user-delete.component';


describe('ExchangeUserDeleteComponent', () => {
    let component: ExchangeUserDeleteComponent;
    let fixture: ComponentFixture<ExchangeUserDeleteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExchangeUserDeleteComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExchangeUserDeleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
