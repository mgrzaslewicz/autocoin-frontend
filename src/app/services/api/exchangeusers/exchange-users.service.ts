import {Inject, Injectable} from '@angular/core';
import {Exchange, ExchangeKeyExistenceResponseDto, ExchangeUser} from '../../../models';
import * as _ from 'underscore';
import {FEATURE_USE_SPRING_AUTH_SERVICE, FeatureToggle, FeatureToggleToken} from '../../feature.toogle.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ExchangeUsersService {

    private clientsApiUrlDeprecated = 'https://clients-api.autocoin-trader.com';
    private exchangeUsersApiUrl = 'https://users-apiv2.autocoin-trader.com';

    constructor(
        private http: HttpClient,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    getExchanges(): Observable<Exchange[]> {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.http.get(`${this.exchangeUsersApiUrl}/exchanges`)
                .map(response => Object.values(response).map(data => this.toExchange(data)));
        } else {
            return this.http.get(`${this.clientsApiUrlDeprecated}/exchanges`)
                .map(response => Object.values(response).map(data => this.toExchange(data)));
        }
    }

    getExchangeUsers(): Observable<ExchangeUser[]> {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.http.get(`${this.exchangeUsersApiUrl}/exchange-users`)
                .map(response => Object.values(response).map(data => this.toExchangeUser(data)));
        } else {
            return this.http.get(`${this.clientsApiUrlDeprecated}/clients`)
                .map(response => Object.values(response).map(data => this.toExchangeUser(data)));
        }
    }

    getExchangesKeysExistence(): Observable<ExchangeKeyExistenceResponseDto[]> {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.http.get<ExchangeKeyExistenceResponseDto[]>(`${this.exchangeUsersApiUrl}/exchange-keys/existence`)
                .map(response => Object.values(response).map(data => this.toExchangeKey(data)));
        } else {
            return this.http.get<ExchangeKeyExistenceResponseDto[]>(`${this.clientsApiUrlDeprecated}/exchange-keys`)
                .map(response => Object.values(response).map(data => this.toExchangeKey(data)));
        }

    }

    private toExchangeUser(data): ExchangeUser {
        const exchangeUser = new ExchangeUser;

        exchangeUser.id = data.id;
        exchangeUser.name = data.name;

        return exchangeUser;
    }

    private toExchange(data): Exchange {
        const exchange = new Exchange;

        exchange.id = data.id;
        exchange.name = data.name;

        return exchange;
    }

    private toExchangeKey(data): ExchangeKeyExistenceResponseDto {
        const exchangeKey = new ExchangeKeyExistenceResponseDto;

        exchangeKey.exchangeId = data.exchangeId ? data.exchangeId : data.exchnageId;
        exchangeKey.exchangeUserId = data.exchangeUserId ? data.exchangeUserId : data.exchangeUserId;

        return exchangeKey;
    }

    createExchangeUser(data) {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.http.put(`${this.exchangeUsersApiUrl}/exchange-users`, data, {responseType: 'text'});
        } else {
            return this.http.post(`${this.clientsApiUrlDeprecated}/clients`, data);
        }

    }

    deleteExchangeUser(exchangeUserId) {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.http.delete(`${this.exchangeUsersApiUrl}/exchange-users/${exchangeUserId}`);
        } else {
            return this.http.delete(`${this.clientsApiUrlDeprecated}/clients/${exchangeUserId}`);
        }

    }

    deleteExchangeKeys(exchangeUserId: string, exchangeId): Observable<string> {
        return this.http.delete(`${this.exchangeUsersApiUrl}/exchange-keys/${exchangeId}/${exchangeUserId}`, {responseType: 'text'});
    }

    findExchangeUser(exchangeUserId): Observable<ExchangeUser> {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.http.get(`${this.exchangeUsersApiUrl}/exchange-users`)
                .map(response => {
                    const data = _(response).find({id: exchangeUserId});

                    return this.toExchangeUser(data);
                });
        } else {
            return this.http.get(`${this.clientsApiUrlDeprecated}/clients`)
                .map(response => {
                    let data = _(response).find({id: exchangeUserId});

                    return this.toExchangeUser(data);
                });
        }
    }

    getExchangeKeysExistenceForExchangeUser(exchangeUserId): Observable<ExchangeKeyExistenceResponseDto[]> {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.http.get(`${this.exchangeUsersApiUrl}/exchange-keys/existence/${exchangeUserId}`)
                .map(response => Object.values(response).map(data => this.toExchangeKey(data)));
        } else {
            return this.http.get(`${this.clientsApiUrlDeprecated}/clients/${exchangeUserId}/exchange-keys`)
                .map(response => Object.values(response).map(data => this.toExchangeKey(data)));
        }
    }

    updateExchangeUser(exchangeUserId, data) {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.http.post(`${this.exchangeUsersApiUrl}/exchange-users/${exchangeUserId}`, data, {responseType: 'text'});
        } else {
            return this.http.put(`${this.clientsApiUrlDeprecated}/clients/${exchangeUserId}`, data);
        }
    }

    updateExchangeKeys(exchangeUserId, exchangeId, data) {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.http.put(`${this.exchangeUsersApiUrl}/exchange-keys/${exchangeId}/${exchangeUserId}`, data, {responseType: 'text'});
        } else {
            return this.http.post(`${this.clientsApiUrlDeprecated}/clients/${exchangeUserId}/exchange-keys/${exchangeId}`, data);
        }
    }

}
