import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {ExchangeKeyCapabilityResponseDto} from '../models';
import {HttpClient} from '@angular/common/http';
import {ExchangeMediatorUrlToken} from '../../environments/endpoint-tokens';

@Injectable()
export class ExchangeKeyCapabilityService {

    constructor(private http: HttpClient,
                @Inject(ExchangeMediatorUrlToken) private exchangeMediatorUrl: string) {
    }

    getExchangeKeysValidity(exchangeUserId): Observable<ExchangeKeyCapabilityResponseDto[]> {
        return this.http.get<ExchangeKeyCapabilityResponseDto[]>(`${this.exchangeMediatorUrl}/exchange-keys-capability/${exchangeUserId}`);
    }

}
