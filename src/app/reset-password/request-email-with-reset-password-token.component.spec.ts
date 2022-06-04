import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ResetPasswordComponent} from './reset-password.component';
import {RequestEmailWithResetPasswordTokenComponent} from "./request-email-with-reset-password-token.component";


describe('RequestEmailWithResetPasswordTokenComponent', () => {
    let component: RequestEmailWithResetPasswordTokenComponent;
    let fixture: ComponentFixture<RequestEmailWithResetPasswordTokenComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RequestEmailWithResetPasswordTokenComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RequestEmailWithResetPasswordTokenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component)
            .toBeTruthy();
    });
});
