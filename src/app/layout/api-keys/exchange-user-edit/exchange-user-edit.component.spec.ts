import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ExchangeUserEditComponent} from './exchange-user-edit.component';


describe('ExchangeUserEditComponent', () => {
    let component: ExchangeUserEditComponent;
    let fixture: ComponentFixture<ExchangeUserEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExchangeUserEditComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExchangeUserEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
