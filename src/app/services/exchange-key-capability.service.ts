import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {ExchangeKeyCapabilityResponseDto} from '../models';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ExchangeKeyCapabilityService {

    private keyCapabilityApiUrl = 'http://localhost:9001';

    constructor(private http: HttpClient) {
    }

    getExchangeKeysValidity(exchangeUserId): Observable<ExchangeKeyCapabilityResponseDto[]> {
        return this.http.get(`${this.keyCapabilityApiUrl}/exchange-keys-capability/${exchangeUserId}`)
            .map(response => Object.values(response).map(data => this.toExchangeKeyValidity(data)));
    }

    private toExchangeKeyValidity(data): ExchangeKeyCapabilityResponseDto {
        return new ExchangeKeyCapabilityResponseDto(data.exchangeId, data.exchangeUserId, data.canReadWallet);
    }

}
