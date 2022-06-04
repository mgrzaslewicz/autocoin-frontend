import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {routerTransition} from '../router.animations';
import {NgForm} from '@angular/forms';
import {ToastService} from '../services/toast.service';
import {UserAccountService} from "../services/user-account.service";
import {Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {RESET_PASSWORD_TOKEN_PARAM} from "./reset-password-routing-parameter";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    animations: [routerTransition()]
})
export class ResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordForm', {static: true})
    public resetPasswordForm: NgForm;
    private resetPasswordToken: string = null;

    public newPassword: string = "";
    public repeatNewPassword: string = "";
    public isBeforePasswordReset = true;
    public arePasswordsDifferent = false;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private userAccountService: UserAccountService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.resetPasswordToken = this.activatedRoute.snapshot.paramMap.get(RESET_PASSWORD_TOKEN_PARAM);
    }

    onSubmit(resetPasswordForm: NgForm) {
        if (this.areValidPasswordsProvided()) {
            this.userAccountService.resetPasswordWithToken(this.newPassword, this.resetPasswordToken, (observable: Observable<string>) => {
                observable.subscribe(() => {
                    this.isBeforePasswordReset = false;
                }, (error: HttpErrorResponse) => {
                    if (error.status == 404) {
                        this.toastService.warning('Cannot reset password. The token does not exist, was already used or is expired');
                    } else {
                        this.toastService.warning('Something went wrong, please try again later');
                    }
                });
            });
        }
    }

    onPasswordsChanged() {
        this.arePasswordsDifferent = this.newPassword != this.repeatNewPassword;
    }

    areValidPasswordsProvided() {
        return !this.arePasswordsDifferent && this.newPassword.length > 0 && this.repeatNewPassword.length > 0;
    }
}
