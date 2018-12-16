import {Component, OnInit} from '@angular/core';
import {UserAccountService} from '../../../services/user-account.service';
import {ToastService} from '../../../services/toast.service';

@Component({
    selector: 'app-two-factor-authentication',
    templateUrl: './two-factor-authentication.component.html',
    styleUrls: ['./two-factor-authentication.component.scss']
})
export class TwoFactorAuthenticationComponent implements OnInit {

    twoFactorAuthenticationState: string = null;
    secret2FACode: string = null;
    secret2FACodeQrCodeImageUrl: string = null;
    current2FACode: number = null;
    operationInProgress = false;

    constructor(private userAccountService: UserAccountService,
                private toastService: ToastService) {
    }


    ngOnInit() {
        this.userAccountService.is2FAEnabled().subscribe(enabled => {
                if (enabled === true) {
                    this.twoFactorAuthenticationState = 'enabled';
                } else {
                    this.twoFactorAuthenticationState = 'disabled';
                }
            }
        );
    }

    private serverErrorOrMessage(error, message: string): string {
        if (error.error) {
            return error.error;
        } else {
            return message;
        }
    }

    public disableTwoFactorAuthentication() {
        this.operationInProgress = true;
        this.userAccountService.disableTwoFactorAuthentication(this.current2FACode).subscribe(() => {
                this.operationInProgress = false;
                this.twoFactorAuthenticationState = 'disabled';
                this.current2FACode = null;
                this.operationInProgress = false;
                this.toastService.success('2FA disabled');
            },
            error => {
                this.operationInProgress = false;
                this.toastService.danger(this.serverErrorOrMessage(error, 'Could not disable 2FA'));
            }
        );

    }

    public enableTwoFactorAuthentication() {
        this.operationInProgress = true;
        this.userAccountService.enableTwoFactorAuthentication(this.current2FACode).subscribe(() => {
                this.operationInProgress = false;
                this.twoFactorAuthenticationState = 'enabled';
                this.current2FACode = null;
                this.toastService.success('2FA enabled');
            },
            error => {
                this.operationInProgress = false;
                this.toastService.danger(this.serverErrorOrMessage(error, 'Could not enable 2FA'));
            }
        );
    }

    public showGenerateSecretCodeStep() {
        this.operationInProgress = true;
        this.userAccountService.generateSecret2FACode().subscribe(secretCode => {
                this.operationInProgress = false;
                this.secret2FACode = secretCode;
                this.secret2FACodeQrCodeImageUrl = this.getGoogleChartQrCodeImageUrl(secretCode);
                this.twoFactorAuthenticationState = 'generateSecretCode';
            },
            error => {
                this.operationInProgress = false;
                this.toastService.danger(error);
            }
        );
    }

    public copyInputToClipboard(inputElement) {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
    }

    private getGoogleChartQrCodeImageUrl(secretCode: string) {
        const keyName = 'Autocoin';
        return `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/${keyName}%3Fsecret%3D${secretCode}`;
    }

}
