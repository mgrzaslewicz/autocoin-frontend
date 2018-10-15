import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TwoFactorAuthenticationSettingsComponent} from './two-factor-authentication-settings.component';


describe('TwoFactorAuthenticationSettingsComponent', () => {
    let component: TwoFactorAuthenticationSettingsComponent;
    let fixture: ComponentFixture<TwoFactorAuthenticationSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TwoFactorAuthenticationSettingsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TwoFactorAuthenticationSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
