import {Inject, Injectable} from '@angular/core';
import {Exchange, ExchangeKeyExistenceResponseDto, ExchangeUser} from '../../../models';
import * as _ from 'underscore';
import {FeatureToggle, FeatureToggleToken} from '../../feature.toogle.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExchangeUsersEndpointUrlToken} from '../../../../environments/endpoint-tokens';

@Injectable()
export class ExchangeUsersService {

    constructor(
        private http: HttpClient,
        @Inject(ExchangeUsersEndpointUrlToken) private exchangeUsersApiUrl: string,
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
        return new ExchangeUser(data.id, data.name);
    }

    private toExchange(data): Exchange {
        return new Exchange(data.id, data.name);
    }

    private toExchangeKey(data): ExchangeKeyExistenceResponseDto {
        return new ExchangeKeyExistenceResponseDto(data.exchangeId, data.exchangeUserId);
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
