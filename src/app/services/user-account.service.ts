import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';
import {Observable} from 'rxjs';
import {AuthService, ClientTokenResponseDto} from './auth.service';
import {AuthServiceUrlToken,} from '../../environments/endpoint-tokens';
import {ToastService} from "./toast.service";

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

export interface ResetUserAccountPasswordWithTokenRequestDto {
    newPassword: string;
    resetPasswordToken: string;
}

export interface AddRoleToUserRequestDto {
    userEmailAddress: string;
    roleName: string;
}

export interface RemoveRoleFromUserRequestDto {
    userEmailAddress: string;
    roleName: string;
}

@Injectable()
export class UserAccountService {

    constructor(
        private http: HttpClient,
        @Inject(AuthServiceUrlToken) private authServiceUrl: string,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle,
        private authService: AuthService,
        private toastService: ToastService
    ) {
    }

    public is2FAEnabled(): Observable<boolean> {
        return this.http.get<boolean>(`${this.authServiceUrl}/user-accounts/2fa`);
    }

    public generateSecret2FACode(): Observable<string> {
        return this.http.post(`${this.authServiceUrl}/user-accounts/2fa/step1-generate-secret-code`, null, {responseType: 'text'});
    }

    public enableTwoFactorAuthentication(twoFactorAuthenticationCode: number): Observable<string> {
        return this.http.post(`${this.authServiceUrl}/user-accounts/2fa/step2-enable/${twoFactorAuthenticationCode}`, null, {responseType: 'text'});
    }

    public disableTwoFactorAuthentication(twoFactorAuthenticationCode: number): Observable<string> {
        return this.http.post(`${this.authServiceUrl}/user-accounts/2fa/disable/${twoFactorAuthenticationCode}`, null, {responseType: 'text'}
        );
    }

    public changePassword(oldPassword: string, newPassword: string, confirmPassword: string, twoFactorAuthenticationCode: number): Observable<ChangePasswordResponseDto> {
        return this.http.post<ChangePasswordResponseDto>(`${this.authServiceUrl}/user-accounts/password`, {
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

    public requestEmailWithResetPasswordToken(emailAddress: string, callback: (observable: Observable<string>) => void) {
        this.authService.requestClientToken()
            .subscribe((clientToken: ClientTokenResponseDto) => {
                console.log('Received client access token');
                const headers = new HttpHeaders({'Authorization': `Bearer ${clientToken.access_token}`});
                callback(this.http.post(`${this.authServiceUrl}/user-accounts/password/reset-with-token/step-1-send-email-with-token?email=${emailAddress}`,
                    null,
                    {
                        headers: headers,
                        responseType: 'text'
                    }
                ));
            }, error => {
                console.error(error);
                console.error('Request to get client token failed');
                this.toastService.warning('Something went wrong, please try again later');
            });
    }

    public resetPasswordWithToken(newPassword: string, resetPasswordToken: string, callback: (observable: Observable<string>) => void) {
        this.authService.requestClientToken()
            .subscribe((clientToken: ClientTokenResponseDto) => {
                console.log('Received client access token');
                const headers = new HttpHeaders({'Authorization': `Bearer ${clientToken.access_token}`});
                callback(this.http.post(`${this.authServiceUrl}/user-accounts/password/reset-with-token/step-2-change-password`, {
                            newPassword: newPassword,
                            resetPasswordToken: resetPasswordToken
                        } as ResetUserAccountPasswordWithTokenRequestDto,
                        {
                            headers: headers,
                            responseType: 'text'
                        })
                );
            }, error => {
                console.error(error);
                console.error('Request to get client token failed');
                this.toastService.warning('Something went wrong, please try again later');
            });
    }

    public addRoleToUser(role: string, userEmailAddress: string): Observable<string> {
        return this.http.put(`${this.authServiceUrl}/user-accounts/role`, {
                userEmailAddress: userEmailAddress,
                roleName: role
            } as AddRoleToUserRequestDto,
            {responseType: 'text'}
        );
    }

    public removeRoleFromUser(role: string, userEmailAddress: string): Observable<string> {
        return this.http.request('delete', `${this.authServiceUrl}/user-accounts/role`, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: {
                userEmailAddress: userEmailAddress,
                roleName: role
            } as RemoveRoleFromUserRequestDto,
            responseType: 'text'
        });
    }

}
