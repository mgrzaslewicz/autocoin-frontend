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
        return this.http.get<ExchangeKeyCapabilityResponseDto[]>(`${this.exchangeKeysCapabilityEndpointUrl}/exchange-keys-capability/${exchangeUserId}`);
    }

}
