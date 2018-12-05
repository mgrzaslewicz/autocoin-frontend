import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FeatureToggle, FeatureToggleToken} from './feature.toogle.service';

@Injectable()
export class AuthService {

    oauthTokenEndpointUrl = 'https://users-apiv2.autocoin-trader.com/oauth/token';

    constructor(
        private http: HttpClient,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    login(username, password) {
        let body = new HttpParams()
            .set('client_id', 'SPA')
            .set('client_secret', 'superSecretPassword')
            .set('password', password)
            .set('username', username)
            .set('grant_type', 'password')
            .set('scopes', 'read');

        const headers = new HttpHeaders()
            .append('Cache-Control', 'no-cache')
            .append('Content-Type', 'application/x-www-form-urlencoded');

        const options = {
            headers
        };

        return this.http.post(this.oauthTokenEndpointUrl, body, options)
            .do(response => {
                this.storeAccessToken(response['access_token']);
                this.storeUserName(username);
            });
    }

    oauthTokenExists(): Boolean {
        return this.token() != null;
    }

    token() {
        return localStorage.getItem('tokenV2');
    }

    userName(): String {
        return localStorage.getItem('userName');
    }

    logout() {
        localStorage.removeItem('tokenV2');
    }

    private storeAccessToken(accessToken) {
        localStorage.setItem('tokenV2', accessToken);
    }

    private storeUserName(userName) {
        localStorage.setItem('userName', userName);
    }

}
