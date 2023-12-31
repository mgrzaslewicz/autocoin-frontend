import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthServiceUrlToken} from '../../environments/endpoint-tokens';
import {Observable} from 'rxjs';

interface UserAccountDto {
    shouldChangePassword: boolean;
    userAccountId: string;
    userRoles: string[];
}

interface TokenResponseDto {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    userAccount: UserAccountDto;
}

export interface ClientTokenResponseDto {
    access_token: string;
    token_type: string;
}


@Injectable()
export class AuthService {
    private refreshTokenKey = 'refreshToken';
    private tokenExpiresAtMillisKey = 'tokenExpiresAtMillis';
    private accessTokenKey = 'accessToken';
    private userRolesKey = 'userRoles';
    private userNameKey = 'userName';
    private userAccount: UserAccountDto = null;
    private oauthTokenEndpointUrl = `${this.authServiceUrl}/oauth/token`;

    constructor(
        @Inject(AuthServiceUrlToken) private authServiceUrl,
        private http: HttpClient
    ) {
    }

    login(emailAddress, password, twoFactorAuthenticationCode): Observable<TokenResponseDto> {
        const body = new HttpParams()
            .set('client_id', 'SPA')
            .set('client_secret', 'superSecretPassword')
            .set('password', password)
            .set('username', emailAddress)
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
                this.storeUserName(emailAddress);
                this.storeUserRoles(response.userAccount.userRoles);
                this.setUserAccount(response.userAccount);
            });
    }

    public requestClientToken(): Observable<ClientTokenResponseDto> {
        const body = new HttpParams()
            .set('client_id', 'SPA')
            .set('client_secret', 'superSecretPassword')
            .set('grant_type', 'client_credentials');

        const headers = new HttpHeaders()
            .append('Cache-Control', 'no-cache')
            .append('Content-Type', 'application/x-www-form-urlencoded');

        const options = {
            headers
        };
        return this.http.post<ClientTokenResponseDto>(this.oauthTokenEndpointUrl, body, options);
    }

    /**
     * TODO find a better way (like interceptor) to handle refreshing token before business logic request.
     * Now every component related to position in menu invokes this manually
     */
    refreshTokenIfExpiringSoon(): Observable<TokenResponseDto> {
        if (this.tokenExpiresIn10MinutesOrLess()) {
            return this.refreshToken();
        } else {
            return Observable.of(null);
        }
    }

    refreshTokenAndDoNothing() {
        this.refreshToken()
            .subscribe(() => {
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
                this.storeTokenExpiresAt(response.expires_in);
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


    userName(): string {
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

    private storeTokenExpiresAt(expiresInSeconds: number) {
        const expiresAtMillis = new Date().getTime() + expiresInSeconds * 1000;
        localStorage.setItem(this.tokenExpiresAtMillisKey, expiresAtMillis.toString());
    }

    private storeUserName(userName) {
        localStorage.setItem(this.userNameKey, userName);
    }

    private storeUserRoles(userRoles) {
        localStorage.setItem(this.userRolesKey, JSON.stringify(userRoles));
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

    private tokenExpiresIn10MinutesOrLess() {
        const tokenExpiresAtMillisString = localStorage.getItem(this.tokenExpiresAtMillisKey);
        const tokenExpiresAtMillis = parseInt(tokenExpiresAtMillisString, 10);
        const tenMinutes = 60 * 10 * 1000;
        if (tokenExpiresAtMillisString != null && typeof tokenExpiresAtMillis === 'number') {
            return tokenExpiresAtMillis - new Date().getTime() < tenMinutes;
        } else {
            return false;
        }
    }

    private getUserRoles(): string[] {
        const userRoles = localStorage.getItem(this.userRolesKey);
        if (userRoles != null) {
            return JSON.parse(userRoles);
        } else {
            return [];
        }
    }

    isRoleAssignedToUser(roleName: string) {
        return this.getUserRoles()
            .indexOf(roleName) !== -1;
    }

    isAdmin() {
        return this.isRoleAssignedToUser('ROLE_ADMIN');
    }
}
