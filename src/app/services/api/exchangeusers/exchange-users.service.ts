import {Inject, Injectable} from '@angular/core';
import {CreateExchangeUserRequestDto, ExchangeDto, ExchangeKeyExistenceResponseDto, ExchangeUserDto, UpdateExchangeKeyRequestDto} from '../../../models';
import {FeatureToggle, FeatureToggleToken} from '../../feature.toogle.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthServiceUrlToken} from '../../../../environments/endpoint-tokens';

@Injectable()
export class ExchangeUsersService {

    constructor(
        private http: HttpClient,
        @Inject(AuthServiceUrlToken) private authServiceUrl: string,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    getExchanges(): Observable<ExchangeDto[]> {
        return this.http.get<ExchangeDto[]>(`${this.authServiceUrl}/exchanges`);
    }

    getExchangeUsers(): Observable<ExchangeUserDto[]> {
        return this.http.get<ExchangeUserDto[]>(`${this.authServiceUrl}/exchange-users`);
    }

    getExchangesKeysExistence(): Observable<ExchangeKeyExistenceResponseDto[]> {
        return this.http.get<ExchangeKeyExistenceResponseDto[]>(`${this.authServiceUrl}/exchange-keys/existence`);
    }

    createExchangeUser(data: CreateExchangeUserRequestDto) {
        return this.http.put(`${this.authServiceUrl}/exchange-users`, data, {responseType: 'text'});
    }

    deleteExchangeUser(exchangeUserId) {
        return this.http.delete(`${this.authServiceUrl}/exchange-users/${exchangeUserId}`);
    }

    deleteExchangeKeys(exchangeUserId: string, exchangeId): Observable<string> {
        return this.http.delete(`${this.authServiceUrl}/exchange-keys/${exchangeId}/${exchangeUserId}`, {responseType: 'text'});
    }

    getExchangeUser(exchangeUserId): Observable<ExchangeUserDto> {
        return this.http.get<ExchangeUserDto>(`${this.authServiceUrl}/exchange-users/${exchangeUserId}`);
    }

    getExchangeKeysExistenceForExchangeUser(exchangeUserId): Observable<ExchangeKeyExistenceResponseDto[]> {
        return this.http.get<ExchangeKeyExistenceResponseDto[]>(`${this.authServiceUrl}/exchange-keys/existence/${exchangeUserId}`);
    }

    updateExchangeUser(exchangeUserId, data) {
        return this.http.post(`${this.authServiceUrl}/exchange-users/${exchangeUserId}`, data, {responseType: 'text'});
    }

    updateExchangeKeys(exchangeUserId, exchangeId, requestDto: UpdateExchangeKeyRequestDto) {
        return this.http.put(`${this.authServiceUrl}/exchange-keys/${exchangeId}/${exchangeUserId}`, requestDto, {responseType: 'text'});
    }

}
