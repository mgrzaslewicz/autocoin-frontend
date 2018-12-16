import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';
import {Observable} from 'rxjs';

@Injectable()
export class UserAccountService {
    twoFactorAuthenticationEndpointUrl = 'https://users-apiv2.autocoin-trader.com/user-accounts/2fa';

    constructor(
        private http: HttpClient,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    public is2FAEnabled(): Observable<boolean> {
        return this.http.get<boolean>(this.twoFactorAuthenticationEndpointUrl);
    }

    public generateSecret2FACode(): Observable<string> {
        return this.http.post(`${this.twoFactorAuthenticationEndpointUrl}/step1-generate-secret-code`, null, {responseType: 'text'});
    }

    public enableTwoFactorAuthentication(twoFactorAuthenticationCode: number): Observable<string> {
        return this.http.post(`${this.twoFactorAuthenticationEndpointUrl}/step2-enable/${twoFactorAuthenticationCode}`, null, {responseType: 'text'});
    }

    public disableTwoFactorAuthentication(twoFactorAuthenticationCode: number): Observable<string> {
        return this.http.post(`${this.twoFactorAuthenticationEndpointUrl}/disable/${twoFactorAuthenticationCode}`, null, {responseType: 'text'}
        );
    }

}
