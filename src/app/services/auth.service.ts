import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FEATURE_USE_SPRING_AUTH_SERVICE, FeatureToggle, FeatureToggleToken} from './feature.toogle.service';

@Injectable()
export class AuthService {

    usersApiTokenDeprecated = 'https://users-api.autocoin-trader.com/ids/connect/token';
    usersApiToken = 'https://users-apiv2.autocoin-trader.com/oauth/token';

    constructor(
        private http: HttpClient,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    login(username, password) {
        let body = new HttpParams()
            .set('client_id', 'SPA')
            .set('client_secret', 'superSecretPassword')
            .set('userName', username)
            .set('password', password)
            .set('grant_type', 'username_password')
            .set('scopes', 'API.read');

        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            body = body.set('username', username)
                .set('grant_type', 'password')
                .set('scopes', 'API.read');
        }

        const headers = new HttpHeaders()
            .append('Cache-Control', 'no-cache')
            .append('Content-Type', 'application/x-www-form-urlencoded');

        const options = {
            headers
        };

        const tokenEndpointUrl = this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE) ? this.usersApiToken : this.usersApiTokenDeprecated;

        return this.http.post(tokenEndpointUrl, body, options)
            .do(response => {
                this.storeAccessToken(response['access_token']);
                this.storeUserName(username);
            });
    }

    oauthTokenExists(): Boolean {
        return this.token() != null;
    }

    token() {
        return localStorage.getItem('token');
    }

    userName(): String {
        return localStorage.getItem('userName');
    }

    logout() {
        localStorage.removeItem('token');
    }

    private storeAccessToken(accessToken) {
        localStorage.setItem('token', accessToken);
    }

    private storeUserName(userName) {
        localStorage.setItem('userName', userName);
    }

}
