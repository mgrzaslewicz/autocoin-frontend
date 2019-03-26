import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountPasswordComponent } from './two-factor-authentication.component';

describe('TwoFactorAuthenticationComponent', () => {
  let component: UserAccountPasswordComponent;
  let fixture: ComponentFixture<UserAccountPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
