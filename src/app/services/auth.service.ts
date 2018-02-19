import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class AuthService {

    usersApiToken = 'https://users-api.autocoin-trader.com/ids/connect/token';
    userName: String;

    constructor(private http: HttpClient) {
    }

    login(username, password) {
        let body = new HttpParams()
            .set('client_id', 'SPA')
            .set('client_secret', 'superSecretPassword')
            .set('userName', username)
            .set('password', password)
            .set('grant_type', 'username_password')
            .set('scopes', 'API.read');

        let headers = new HttpHeaders()
            .append('Cache-Control', 'no-cache')
            .append('Content-Type', 'application/x-www-form-urlencoded');

        let options = {
            headers
        };

        return this.http.post(this.usersApiToken, body, options)
            .do(response => {
                this.storeAccessToken(response['access_token']);
                this.userName = username;
            });
    }

    check() {
        return this.token() != null;
    }

    token() {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
    }

    private storeAccessToken(accessToken) {
        localStorage.setItem('token', accessToken);
    }

}
