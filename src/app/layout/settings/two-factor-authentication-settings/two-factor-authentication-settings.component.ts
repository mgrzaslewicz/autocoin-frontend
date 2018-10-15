import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-two-factor-authentication',
    templateUrl: './two-factor-authentication-settings.component.html',
    styleUrls: ['./two-factor-authentication-settings.component.scss']
})
export class TwoFactorAuthenticationSettingsComponent implements OnInit {
    protected twoFactorAuthenticationState: string;

    constructor() {
    }

    ngOnInit() {
        this.twoFactorAuthenticationState = 'disabled';
    }

    public disableTwoFactorAuthentication() {
        this.twoFactorAuthenticationState = 'disabled';
    }

    public enableTwoFactorAuthentication() {
        this.twoFactorAuthenticationState = 'enabled';
    }

}
