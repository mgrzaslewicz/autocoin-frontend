import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {BalanceMonitorApiBaseUrlToken} from "../../environments/endpoint-tokens";
import {FeatureToggle, FeatureToggleToken} from "./feature.toogle.service";
import {Observable} from "rxjs";

export interface HasValueInOtherCurrency {
    valueInOtherCurrency?: Map<string, string>;
}

export interface HasPriceInOtherCurrency {
    priceInOtherCurrency?: Map<string, string>;
}

export interface HasBalance {
    balance?: string;
}

export interface BlockchainWalletResponseDto extends HasBalance {
    id: string;
    walletAddress: string;
    currency: string;
    description?: string;
    usdBalance?: string;
    blockChainExplorerUrl?: string;
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

export interface BlockchainWalletCurrencyBalanceResponseDto extends HasBalance {
    currency: string;
    usdBalance?: string;
    usdPrice?: string;
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
    pricesInOtherCurrencies: Map<string, Map<string, string>>;
    exchangeCurrencyBalances: ExchangeCurrencyBalancesResponseDto[];
}

export interface ExchangeCurrencySummaryDto extends HasValueInOtherCurrency, HasBalance {
    exchangeName: string;
}

export interface BlockchainWalletCurrencySummaryDto extends HasValueInOtherCurrency, HasBalance {
    walletAddress: string;
}

export interface CurrencyAssetSummaryDto extends HasValueInOtherCurrency, HasBalance {
    description?: string;
}

export interface CurrencyBalanceSummaryDto extends HasValueInOtherCurrency, HasBalance, HasPriceInOtherCurrency {
    currency: string;
    exchanges: ExchangeCurrencySummaryDto[];
    wallets: BlockchainWalletCurrencySummaryDto[];
    currencyAssets: CurrencyAssetSummaryDto[];
}

export interface BalanceSummaryResponseDto {
    isShowingRealBalance: boolean;
    currencyBalances: CurrencyBalanceSummaryDto[];
}

export interface ExchangeCurrencyBalanceDto extends HasValueInOtherCurrency {
    currencyCode: string;
    amountAvailable: string;
    amountInOrders: string;
    totalAmount: string;
    priceInOtherCurrency?: Map<string, string>;
}

export interface ExchangeBalanceDto {
    exchangeName: string;
    currencyBalances: ExchangeCurrencyBalanceDto[];
    errorMessage?: string;
}

export interface UserCurrencyAssetResponseDto extends HasValueInOtherCurrency, HasBalance {
    id: string;
    currency: string;
    walletAddress?: string;
    blockChainExplorerUrl?: string;
    description: string;
}

export interface UserCurrencyAssetSummaryResponseDto extends HasValueInOtherCurrency, HasBalance, HasPriceInOtherCurrency {
    currency: string;
}

export interface UserCurrencyAssetsResponseDto {
    userCurrencyAssets: UserCurrencyAssetResponseDto[];
    userCurrencyAssetsSummary: UserCurrencyAssetSummaryResponseDto[];
}

export interface UpdateUserCurrencyAssetRequestDto extends HasBalance {
    id: string;
    currency: string;
    description?: string;
    walletAddress?: string;
}

export interface AddUserCurrencyAssetRequestDto extends HasBalance {
    currency: string;
    description?: string;
    walletAddress?: string;
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

    getUserCurrencyAssetsBalance(): Observable<UserCurrencyAssetsResponseDto> {
        return this.http.get<UserCurrencyAssetsResponseDto>(`${this.balanceMonitorApiBaseUrl}/user-currency-assets`);
    }

    deleteUserCurrencyAsset(userCurrencyAssetId: string): Observable<string> {
        return this.http.delete<string>(`${this.balanceMonitorApiBaseUrl}/user-currency-assets/${userCurrencyAssetId}`);
    }

    getUserCurrencyAsset(userCurrencyAssetId: string): Observable<UserCurrencyAssetResponseDto> {
        return this.http.get<UserCurrencyAssetResponseDto>(`${this.balanceMonitorApiBaseUrl}/user-currency-assets/${userCurrencyAssetId}`);
    }

    updateUserCurrencyAsset(updateUserCurrencyAssetRequest: UpdateUserCurrencyAssetRequestDto): Observable<UpdateBlockchainWalletErrorResponseDto> {
        return this.http.put<UpdateBlockchainWalletErrorResponseDto>(`${this.balanceMonitorApiBaseUrl}/user-currency-assets/${updateUserCurrencyAssetRequest.id}`, updateUserCurrencyAssetRequest);
    }

    addUserCurrencyAssets(addUserCurrencyAssetsRequestDtos: Array<AddUserCurrencyAssetRequestDto>): Observable<string> {
        return this.http.post<string>(`${this.balanceMonitorApiBaseUrl}/user-currency-assets`, addUserCurrencyAssetsRequestDtos);
    }

}
