import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {ExchangeKeyCapabilityResponseDto} from '../models';
import {HttpClient} from '@angular/common/http';
import {ExchangeKeysCapabilityEndpointUrlToken} from '../../environments/endpoint-tokens';

@Injectable()
export class ExchangeKeyCapabilityService {

    constructor(private http: HttpClient,
                @Inject(ExchangeKeysCapabilityEndpointUrlToken) private exchangeKeysCapabilityEndpointUrl: string) {
    }

    getExchangeKeysValidity(exchangeUserId): Observable<ExchangeKeyCapabilityResponseDto[]> {
        return this.http.get(`${this.exchangeKeysCapabilityEndpointUrl}/exchange-keys-capability/${exchangeUserId}`)
            .map(response => Object.values(response).map(data => this.toExchangeKeyValidity(data)));
    }

    private toExchangeKeyValidity(data): ExchangeKeyCapabilityResponseDto {
        return new ExchangeKeyCapabilityResponseDto(data.exchangeId, data.exchangeUserId, data.canReadWallet);
    }

}
