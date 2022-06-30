import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {BalanceMonitorApiBaseUrlToken} from "../../environments/endpoint-tokens";
import {FeatureToggle, FeatureToggleToken} from "./feature.toogle.service";
import {Observable} from "rxjs";

export interface BlockchainWalletResponseDto {
    id: string;
    walletAddress: string;
    currency: string;
    description?: string;
    balance?: string;
    usdBalance?: string;
}

export interface AddBlockchainWalletsErrorResponseDto {
    duplicatedAddresses: Array<string>;
    invalidAddresses: Array<string>;
}

export interface AddBlockchainWalletRequestDto {
    walletAddress: string;
    currency: string;
    description?: string;
}

export interface UpdateBlockchainWalletRequestDto {
    id: string;
    walletAddress: string;
    currency: string;
    description?: string;
}

export interface UpdateBlockchainWalletErrorResponseDto {
    isAddressDuplicated: boolean;
    isAddressInvalid: boolean;
    isIdInvalid: boolean;
}

export interface BlockchainWalletCurrencyBalanceResponseDto {
    currency: string;
    balance?: string;
    usdBalance?: string;
}

export interface ExchangeCurrencyBalancesResponseDto {
    exchangeUserId: string;
    exchangeUserName: string;
    exchangeBalances: ExchangeBalanceDto[];
}

export interface ExchangeWalletBalancesResponseDto {
    refreshTimeMillis?: number;
    exchangeCurrencyBalances: ExchangeCurrencyBalancesResponseDto[];
}

export interface ExchangeWalletBalancesResponseDto {
    refreshTimeMillis?: number;
    isShowingRealBalance: boolean;
    exchangeCurrencyBalances: ExchangeCurrencyBalancesResponseDto[];
}

export interface ExchangeCurrencySummaryDto {
    exchangeName: string;
    balance: string;
    valueInOtherCurrency?: Map<string, string>;
}

export interface BlockchainWalletCurrencySummaryDto {
    walletAddress: string;
    balance?: string;
    valueInOtherCurrency?: Map<string, string>;
}

export interface CurrencyBalanceSummaryDto {
    currency: string;
    balance: string;
    valueInOtherCurrency?: Map<string, string>;
    exchanges: ExchangeCurrencySummaryDto[];
    wallets: BlockchainWalletCurrencySummaryDto[];
}

export interface BalanceSummaryResponseDto {
    isShowingRealBalance: boolean;
    currencyBalances: CurrencyBalanceSummaryDto[];
}

export interface ExchangeCurrencyBalanceDto {
    currencyCode: string;
    amountAvailable: string;
    amountInOrders: string;
    totalAmount: string;
    valueInOtherCurrency?: Map<string, string>;
    priceInOtherCurrency?: Map<string, string>;
}

export interface ExchangeBalanceDto {
    exchangeName: string;
    currencyBalances: ExchangeCurrencyBalanceDto[];
    errorMessage?: string;
}


@Injectable()
export class BalanceMonitorService {
    constructor(
        private http: HttpClient,
        @Inject(BalanceMonitorApiBaseUrlToken) private balanceMonitorApiBaseUrl: string,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    getBlockchainWallets(): Observable<Array<BlockchainWalletResponseDto>> {
        return this.http.get<Array<BlockchainWalletResponseDto>>(`${this.balanceMonitorApiBaseUrl}/blockchain/wallets`);
    }

    getBlockchainCurrencyBalance(): Observable<Array<BlockchainWalletCurrencyBalanceResponseDto>> {
        return this.http.get<Array<BlockchainWalletCurrencyBalanceResponseDto>>(`${this.balanceMonitorApiBaseUrl}/blockchain/wallets/currency/balance`);
    }

    getBlockchainWallet(walletId: string): Observable<BlockchainWalletResponseDto> {
        return this.http.get<BlockchainWalletResponseDto>(`${this.balanceMonitorApiBaseUrl}/blockchain/wallets/${walletId}`);
    }

    addBlockchainWallets(addWalletRequest: Array<AddBlockchainWalletRequestDto>): Observable<string> {
        return this.http.post<string>(`${this.balanceMonitorApiBaseUrl}/blockchain/wallets`, addWalletRequest);
    }

    updateBlockchainWallet(updateWalletRequest: UpdateBlockchainWalletRequestDto): Observable<UpdateBlockchainWalletErrorResponseDto> {
        return this.http.put<UpdateBlockchainWalletErrorResponseDto>(`${this.balanceMonitorApiBaseUrl}/blockchain/wallet`, updateWalletRequest);
    }

    deleteBlockchainWallet(walletAddress: string): Observable<string> {
        return this.http.delete<string>(`${this.balanceMonitorApiBaseUrl}/blockchain/wallet/${walletAddress}`);
    }

    refreshBlockchainWalletsBalance(): Observable<Array<AddBlockchainWalletRequestDto>> {
        return this.http.post<Array<AddBlockchainWalletRequestDto>>(`${this.balanceMonitorApiBaseUrl}/blockchain/wallets/balance/refresh`, null);
    }

    getExchangeWallets(): Observable<ExchangeWalletBalancesResponseDto> {
        return this.http.get<ExchangeWalletBalancesResponseDto>(`${this.balanceMonitorApiBaseUrl}/exchange/wallets`);
    }

    getBalanceSummary(): Observable<BalanceSummaryResponseDto> {
        return this.http.get<BalanceSummaryResponseDto>(`${this.balanceMonitorApiBaseUrl}/balance/summary`);
    }

    refreshBalanceSummary(): Observable<BalanceSummaryResponseDto> {
        return this.http.post<BalanceSummaryResponseDto>(`${this.balanceMonitorApiBaseUrl}/balance/summary`, null);
    }

    refreshExchangeWalletsBalance(): Observable<ExchangeWalletBalancesResponseDto> {
        return this.http.post<ExchangeWalletBalancesResponseDto>(`${this.balanceMonitorApiBaseUrl}/exchange/wallets/balance/refresh`, null);
    }

}
