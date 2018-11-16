import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ExchangeUsersComponent} from './exchange-users.component';


describe('ExchangeUsersComponent', () => {
    let component: ExchangeUsersComponent;
    let fixture: ComponentFixture<ExchangeUsersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExchangeUsersComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExchangeUsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
