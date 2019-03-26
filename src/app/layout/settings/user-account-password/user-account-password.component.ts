import {Component, Input, OnInit} from '@angular/core';
import {UserAccountService} from '../../../services/user-account.service';
import {ToastService} from '../../../services/toast.service';

@Component({
    selector: 'app-user-account-password',
    templateUrl: './user-account-password.component.html',
    styleUrls: ['./user-account-password.component.scss']
})
export class UserAccountPasswordComponent implements OnInit {
    @Input()
    shouldChangePassword = false;
    isTwoFactorAuthenticationEnabled = false;
    operationInProgress = false;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    current2FACode: string;
    errorMessages: string[];

    constructor(private userAccountService: UserAccountService,
                private toastService: ToastService) {
    }


    ngOnInit() {
        this.newPassword = '';
        this.confirmPassword = '';
        this.oldPassword = '';
        this.current2FACode = '';
        this.operationInProgress = false;
        this.errorMessages = [];
        this.userAccountService.is2FAEnabled().subscribe(enabled => {
                this.isTwoFactorAuthenticationEnabled = enabled;
            }
        );
    }

    changePassword() {
        if (this.areInputsValidToChangePassword()) {
            this.operationInProgress = true;
            this.userAccountService.changePassword(this.oldPassword, this.newPassword, this.confirmPassword, this.getCurrent2FACode())
                .subscribe(() => {
                        this.operationInProgress = false;
                        this.toastService.success('Your password was changed');
                        this.shouldChangePassword = false;
                        this.resetForm();
                    },
                    errorResponse => {
                        if (errorResponse.error && errorResponse.error.errorMessages) {
                            this.errorMessages = errorResponse.error.errorMessages;
                        }
                        this.operationInProgress = false;
                        this.toastService.warning('Something went wrong. Your password was not changed');
                    }
                );
        }
    }

    private getCurrent2FACode(): number {
        const twoFactorAuthenticationCode = Number(this.current2FACode);
        if (typeof twoFactorAuthenticationCode === 'number') {
            return twoFactorAuthenticationCode;
        } else {
            return null;
        }
    }

    areInputsValidToChangePassword() {
        const isTwoFactorAuthenticationCodeValid = (
            (this.isTwoFactorAuthenticationEnabled
                && this.current2FACode.length > 0
                && !Number.isNaN(Number(this.current2FACode))
            ) || !this.isTwoFactorAuthenticationEnabled);
        const result =
            this.oldPassword.length > 0
            && this.newPassword.length > 0
            && this.confirmPassword.length > 0
            && this.newPassword === this.confirmPassword
            && this.newPassword !== this.oldPassword
            && isTwoFactorAuthenticationCodeValid;
        if (this.oldPassword.length === 0) {
            this.errorMessages = ['Old password required'];
        } else if (this.newPassword.length === 0) {
            this.errorMessages = ['New password required'];
        } else if (this.newPassword === this.oldPassword) {
            this.errorMessages = ['New password must be different from the old one'];
        } else if (this.newPassword !== this.confirmPassword) {
            this.errorMessages = ['Confirm password does not match the new one'];
        } else if (!isTwoFactorAuthenticationCodeValid) {
            this.errorMessages = ['2-step verification code is invalid'];
        } else {
            this.errorMessages = [];
        }

        return result;
    }

    private resetForm() {
        this.current2FACode = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.oldPassword = '';
        this.errorMessages = [];
    }
}
