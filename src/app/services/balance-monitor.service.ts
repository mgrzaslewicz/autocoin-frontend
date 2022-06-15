import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {BalanceMonitorApiBaseUrlToken} from "../../environments/endpoint-tokens";
import {FeatureToggle, FeatureToggleToken} from "./feature.toogle.service";
import {Observable} from "rxjs";

export interface WalletResponseDto {
    walletAddress: string;
    currency: string;
    description?: string;
    balance?: string;
}

export interface AddWalletsErrorResponseDto {
    duplicatedAddresses: Array<string>;
    invalidAddresses: Array<string>;
}

export interface AddWalletRequestDto {
    walletAddress: string;
    currency: string;
    description?: string;
}

@Injectable()
export class BalanceMonitorService {
    constructor(
        private http: HttpClient,
        @Inject(BalanceMonitorApiBaseUrlToken) private balanceMonitorApiBaseUrl: string,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    getWallets(): Observable<Array<WalletResponseDto>> {
        return this.http.get<Array<WalletResponseDto>>(`${this.balanceMonitorApiBaseUrl}/wallets`);
    }

    addWallets(addWalletRequest: Array<AddWalletRequestDto>): Observable<string> {
        return this.http.post<string>(`${this.balanceMonitorApiBaseUrl}/wallets`, addWalletRequest);
    }

    deleteWallet(walletAddress: string): Observable<string> {
        return this.http.delete<string>(`${this.balanceMonitorApiBaseUrl}/wallet/${walletAddress}`);
    }

    refreshWalletsBalance(): Observable<Array<AddWalletRequestDto>> {
        return this.http.post<Array<AddWalletRequestDto>>(`${this.balanceMonitorApiBaseUrl}/wallets/balance/refresh`, null);
    }
}
