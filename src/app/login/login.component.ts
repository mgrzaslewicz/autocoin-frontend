import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {routerTransition} from '../router.animations';
import {AuthService} from '../services/auth.service';
import {NgForm} from '@angular/forms';
import {ToastService} from '../services/toast.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    @ViewChild('loginForm')
    public loginForm: NgForm;
    isShowingTwoFactorAuthenticationCodeInput = false;

    constructor(public router: Router,
                private authService: AuthService,
                private toastService: ToastService) {
    }

    ngOnInit() {
    }

    onSubmit(loginForm) {
        this.authService.login(loginForm.value.email, loginForm.value.password, loginForm.value.twoFactorAuthenticationCode)
            .subscribe(() => {
                this.router.navigate(['/dashboard']);
            }, response => {
                if (response.error.error === 'invalid_grant') {
                    if (this.isTwoFactorAuthenticationCodeInvalid(response.error)) {
                        if (this.isShowingTwoFactorAuthenticationCodeInput) {
                            this.toastService.danger('Invalid 2-step authentication code');
                        } else {
                            this.toastService.warning('Please input 2-step authentication code');
                        }
                        this.isShowingTwoFactorAuthenticationCodeInput = true;
                    } else {
                        this.toastService.danger('Wrong username or password.');
                    }
                } else {
                    this.toastService.danger('Service is unavailable. Try again later.');
                }
            });
    }

    private isTwoFactorAuthenticationCodeInvalid(error: any) {
        return error.error_description.indexOf('Invalid verification code') !== -1;
    }

}
