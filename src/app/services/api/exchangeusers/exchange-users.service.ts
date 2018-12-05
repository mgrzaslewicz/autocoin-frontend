import {Inject, Injectable} from '@angular/core';
import {Exchange, ExchangeKeyExistenceResponseDto, ExchangeUser} from '../../../models';
import * as _ from 'underscore';
import {FeatureToggle, FeatureToggleToken} from '../../feature.toogle.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ExchangeUsersService {

    private exchangeUsersApiUrl = 'https://users-apiv2.autocoin-trader.com';

    constructor(
        private http: HttpClient,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    getExchanges(): Observable<Exchange[]> {
        return this.http.get(`${this.exchangeUsersApiUrl}/exchanges`)
            .map(response => Object.values(response).map(data => this.toExchange(data)));
    }

    getExchangeUsers(): Observable<ExchangeUser[]> {
        return this.http.get(`${this.exchangeUsersApiUrl}/exchange-users`)
            .map(response => Object.values(response).map(data => this.toExchangeUser(data)));
    }

    getExchangesKeysExistence(): Observable<ExchangeKeyExistenceResponseDto[]> {
        return this.http.get<ExchangeKeyExistenceResponseDto[]>(`${this.exchangeUsersApiUrl}/exchange-keys/existence`)
            .map(response => Object.values(response).map(data => this.toExchangeKey(data)));
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
        exchangeKey.exchangeId = data.exchangeId;
        exchangeKey.exchangeUserId = data.exchangeUserId;
        return exchangeKey;
    }

    createExchangeUser(data) {
        return this.http.put(`${this.exchangeUsersApiUrl}/exchange-users`, data, {responseType: 'text'});
    }

    deleteExchangeUser(exchangeUserId) {
        return this.http.delete(`${this.exchangeUsersApiUrl}/exchange-users/${exchangeUserId}`);
    }

    deleteExchangeKeys(exchangeUserId: string, exchangeId): Observable<string> {
        return this.http.delete(`${this.exchangeUsersApiUrl}/exchange-keys/${exchangeId}/${exchangeUserId}`, {responseType: 'text'});
    }

    findExchangeUser(exchangeUserId): Observable<ExchangeUser> {
        return this.http.get(`${this.exchangeUsersApiUrl}/exchange-users`)
            .map(response => {
                const data = _(response).find({id: exchangeUserId});

                return this.toExchangeUser(data);
            });
    }

    getExchangeKeysExistenceForExchangeUser(exchangeUserId): Observable<ExchangeKeyExistenceResponseDto[]> {
        return this.http.get(`${this.exchangeUsersApiUrl}/exchange-keys/existence/${exchangeUserId}`)
            .map(response => Object.values(response).map(data => this.toExchangeKey(data)));
    }

    updateExchangeUser(exchangeUserId, data) {
        return this.http.post(`${this.exchangeUsersApiUrl}/exchange-users/${exchangeUserId}`, data, {responseType: 'text'});
    }

    updateExchangeKeys(exchangeUserId, exchangeId, data) {
        return this.http.put(`${this.exchangeUsersApiUrl}/exchange-keys/${exchangeId}/${exchangeUserId}`, data, {responseType: 'text'});
    }

}
