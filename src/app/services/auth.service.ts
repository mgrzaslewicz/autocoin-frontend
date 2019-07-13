import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';
import {OauthEndpointUrlToken} from '../../environments/endpoint-tokens';
import {Observable} from 'rxjs';

interface UserAccountDto {
    shouldChangePassword: boolean;
}

interface TokenResponseDto {
    access_token: String;
    refresh_token: String;
    userAccount: UserAccountDto;
}

@Injectable()
export class AuthService {
    private refreshTokenKey = 'refreshToken';
    private accessTokenKey = 'accessToken';
    private userNameKey = 'userName';
    private userAccount: UserAccountDto = null;

    constructor(
        @Inject(OauthEndpointUrlToken) private oauthTokenEndpointUrl,
        private http: HttpClient,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    login(username, password, twoFactorAuthenticationCode): Observable<TokenResponseDto> {
        const body = new HttpParams()
            .set('client_id', 'SPA')
            .set('client_secret', 'superSecretPassword')
            .set('password', password)
            .set('username', username)
            .set('grant_type', 'password')
            .set('scopes', 'read')
            .set('2faCode', twoFactorAuthenticationCode);

        const headers = new HttpHeaders()
            .append('Cache-Control', 'no-cache')
            .append('Content-Type', 'application/x-www-form-urlencoded');

        const options = {
            headers
        };

        console.log('Requesting token');
        return this.http.post<TokenResponseDto>(this.oauthTokenEndpointUrl, body, options)
            .do(response => {
                console.log('Successful token request');
                this.storeAccessToken(response.access_token);
                this.storeRefreshToken(response.refresh_token);
                this.storeUserName(username);
                this.setUserAccount(response.userAccount);
            });
    }

    refreshTokenAndDoNothing() {
        this.refreshToken().subscribe(() => {
        });
    }

    refreshToken(): Observable<TokenResponseDto> {
        const body = new HttpParams()
            .set('client_id', 'SPA')
            .set('client_secret', 'superSecretPassword')
            .set('grant_type', 'refresh_token')
            .set('refresh_token', this.getRefreshToken())
            .set('scopes', 'read');

        const headers = new HttpHeaders()
            .append('Cache-Control', 'no-cache')
            .append('Content-Type', 'application/x-www-form-urlencoded');

        const options = {
            headers
        };

        console.log('Refreshing token');
        return this.http.post<TokenResponseDto>(this.oauthTokenEndpointUrl, body, options)
            .do(response => {
                console.log('Successful token refresh request');
                this.storeAccessToken(response.access_token);
                this.storeRefreshToken(response.refresh_token);
            });
    }

    oauthTokenExists(): Boolean {
        return this.token() != null;
    }

    token() {
        return localStorage.getItem(this.accessTokenKey);
    }

    getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }


    userName(): String {
        return localStorage.getItem(this.userNameKey);
    }

    logout() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userNameKey);
    }

    private storeAccessToken(accessToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
    }

    private storeRefreshToken(refreshToken) {
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }


    private storeUserName(userName) {
        localStorage.setItem(this.userNameKey, userName);
    }

    private setUserAccount(userAccount: UserAccountDto) {
        this.userAccount = userAccount;
    }

    shouldChangePassword() {
        return this.userAccount != null && this.userAccount.shouldChangePassword;
    }

    onPasswordChanged() {
        console.log('AuthService.onPasswordChanged');
        if (this.userAccount != null) {
            this.userAccount.shouldChangePassword = false;
        }
    }
}
