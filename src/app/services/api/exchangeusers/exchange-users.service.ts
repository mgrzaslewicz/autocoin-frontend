import {Inject, Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs/Observable';
import {Client, Exchange, ExchangeKey} from '../../../models';
import * as _ from 'underscore';
import {FEATURE_USE_SPRING_AUTH_SERVICE, FeatureToggle, FeatureToggleToken} from '../../feature.toogle.service';

@Injectable()
export class ExchangeUsersService {

    private clientsApiUrlDeprecated = 'https://clients-api.autocoin-trader.com';
    private exchangeUsersApiUrl = 'https://users-apiv2.autocoin-trader.com';

    constructor(
        private api: ApiService,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    getExchanges(): Observable<Exchange[]> {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.api.get(`${this.exchangeUsersApiUrl}/exchanges`)
                .map(response => Object.values(response).map(data => this.makeExchange(data)));
        } else {
            return this.api.get(`${this.clientsApiUrlDeprecated}/exchanges`)
                .map(response => Object.values(response).map(data => this.makeExchange(data)));
        }
    }

    getClients(): Observable<Client[]> {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.api.get(`${this.exchangeUsersApiUrl}/user-accounts`)
                .map(response => Object.values(response).map(data => this.makeClient(data)));
        } else {
            return this.api.get(`${this.clientsApiUrlDeprecated}/clients`)
                .map(response => Object.values(response).map(data => this.makeClient(data)));
        }
    }

    getExchangesKeys() {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.api.get(`${this.exchangeUsersApiUrl}/exchange-keys`)
                .map(response => Object.values(response).map(data => this.makeExchangeKey(data)));
        } else {
            return this.api.get(`${this.clientsApiUrlDeprecated}/exchange-keys`)
                .map(response => Object.values(response).map(data => this.makeExchangeKey(data)));
        }

    }

    getClientExchanges(client) {
        return this.api.get(`${this.clientsApiUrlDeprecated}/clients/${client.id}/exchange-keys`);
    }

    private makeClient(data): Client {
        let client = new Client;

        client.id = data.id;
        client.name = data.name;

        return client;
    }

    private makeExchange(data): Exchange {
        let exchange = new Exchange;

        exchange.id = data.id;
        exchange.name = data.name;

        return exchange;
    }

    private makeExchangeKey(data): ExchangeKey {
        let exchangeKey = new ExchangeKey;

        exchangeKey.exchangeId = data.exchangeId ? data.exchangeId : data.exchnageId;
        exchangeKey.clientId = data.clientId;
        exchangeKey.apiKey = data.apiKey;
        exchangeKey.secretKey = data.secretKey;
        exchangeKey.keyIsFilled = data.keyIsFilled;

        return exchangeKey;
    }

    // TODO change to createExchangeUser
    createClient(data) {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.api.put(`${this.exchangeUsersApiUrl}/exchange-users`, data);
        } else {
            return this.api.post(`${this.clientsApiUrlDeprecated}/clients`, data);
        }

    }

    // TODO change to deleteExchangeUser
    deleteClient(exchangeUserId) {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.api.delete(`${this.exchangeUsersApiUrl}/exchange-users/${exchangeUserId}`);
        } else {
            return this.api.delete(`${this.clientsApiUrlDeprecated}/clients/${exchangeUserId}`);
        }

    }

    // TODO change to findExchangeUser
    findClient(clientId): Observable<Client> {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.api.get(`${this.exchangeUsersApiUrl}/exchange-users`)
                .map(response => {
                    let data = _(response).find({id: clientId});

                    return this.makeClient(data);
                });
        } else {
            return this.api.get(`${this.clientsApiUrlDeprecated}/clients`)
                .map(response => {
                    let data = _(response).find({id: clientId});

                    return this.makeClient(data);
                });
        }
    }

    getExchangesForClient(exchangeUserId): Observable<ExchangeKey[]> {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.api.get(`${this.exchangeUsersApiUrl}}/exchange-keys/${exchangeUserId}`)
                .map(response => Object.values(response).map(data => this.makeExchangeKey(data)));
        } else {
            return this.api.get(`${this.clientsApiUrlDeprecated}/clients/${exchangeUserId}/exchange-keys`)
                .map(response => Object.values(response).map(data => this.makeExchangeKey(data)));
        }
    }

    // TODO change to updateExchangeUser
    updateClient(exchangeUserId, data) {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.api.post(`${this.exchangeUsersApiUrl}/exchange-users/${exchangeUserId}`, data);
        } else {
            return this.api.put(`${this.clientsApiUrlDeprecated}/clients/${exchangeUserId}`, data);
        }
    }

    // TODO change to updateExchangesKeys
    updateClientExchangesKeys(exchangeUserId, exchangeId, data) {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            return this.api.post(`${this.exchangeUsersApiUrl}/exchange-keys/${exchangeUserId}/${exchangeId}`, data);
        } else {
            return this.api.post(`${this.clientsApiUrlDeprecated}/clients/${exchangeUserId}/exchange-keys/${exchangeId}`, data);
        }
    }

}
