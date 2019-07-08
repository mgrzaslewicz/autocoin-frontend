import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {ChangePasswordEndpointUrlToken, TwoFactorAuthenticationEndpointUrlToken} from '../../environments/endpoint-tokens';

export interface ChangePasswordResponseDto {
    success: boolean;
    errorMessages: string[];
}

export interface ChangePasswordRequestDto {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    twoFactorAuthenticationCode: number;
}

@Injectable()
export class UserAccountService {

    constructor(
        private http: HttpClient,
        @Inject(TwoFactorAuthenticationEndpointUrlToken) private twoFactorAuthenticationEndpointUrl: string,
        @Inject(ChangePasswordEndpointUrlToken) private changePasswordEndpointUrl: string,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle,
        private authService: AuthService
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

    public changePassword(oldPassword: string, newPassword: string, confirmPassword: string, twoFactorAuthenticationCode: number): Observable<ChangePasswordResponseDto> {
        return this.http.post<ChangePasswordResponseDto>(`${this.changePasswordEndpointUrl}`, {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
            twoFactorAuthenticationCode: twoFactorAuthenticationCode
        } as ChangePasswordRequestDto)
            .do(response => {
                if (response.success) {
                    this.authService.onPasswordChanged();
                }
            });
    }
}
