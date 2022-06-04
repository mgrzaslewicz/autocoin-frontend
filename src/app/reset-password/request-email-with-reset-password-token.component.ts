import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {routerTransition} from '../router.animations';
import {NgForm} from '@angular/forms';
import {ToastService} from '../services/toast.service';
import {UserAccountService} from "../services/user-account.service";
import {Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-request-email-with-reset-password-token',
    templateUrl: './request-email-with-reset-password-token.component.html',
    styleUrls: ['./request-email-with-reset-password-token.component.scss'],
    animations: [routerTransition()]
})
export class RequestEmailWithResetPasswordTokenComponent implements OnInit {
    @ViewChild('requestEmailWithResetPasswordTokenForm', {static: true})
    public resetPasswordForm: NgForm;
    public email: string;

    public isEmailFormVisible: boolean = true;
    public isNextStepVisible: boolean = false;

    private invalidResetPasswordTokenMessage = 'Cannot reset password. The token does not exist, was already used or is expired';

    constructor(public router: Router,
                private userAccountService: UserAccountService,
                private toastService: ToastService) {
    }

    ngOnInit() {
    }

    onSubmit(resetPasswordForm: NgForm) {
        if (this.isEmailValid()) {
            this.userAccountService.requestEmailWithResetPasswordToken(resetPasswordForm.value.email, (observable: Observable<string>) => {
                observable.subscribe(() => {
                    this.showNextStep();
                }, (error: HttpErrorResponse) => {
                    console.error(error);
                    this.toastService.warning('Something went wrong, please try again later');
                });
            });
        }
    }

    private isEmailValid(): boolean {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.email);
    }

    private showNextStep() {
        this.isEmailFormVisible = false;
        this.isNextStepVisible = true;
    }
}
