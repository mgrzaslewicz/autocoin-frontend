import {HttpClient} from "@angular/common/http";
import {Inject, Injectable} from "@angular/core";
import {BalanceMonitorUrlToken} from "../../environments/endpoint-tokens";
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

export interface ExchangeCurrencyBalanceDto extends HasValueInOtherCurrency, HasPriceInOtherCurrency {
    currencyCode: string;
    amountAvailable: string;
    amountInOrders: string;
    totalAmount: string;
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
        @Inject(BalanceMonitorUrlToken) private balanceMonitorApiUrl: string,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    getBlockchainWallets(): Observable<Array<BlockchainWalletResponseDto>> {
        return this.http.get<Array<BlockchainWalletResponseDto>>(`${this.balanceMonitorApiUrl}/blockchain/wallets`);
    }

    getSampleBlockchainWallets(): Observable<Array<BlockchainWalletResponseDto>> {
        return this.http.get<Array<BlockchainWalletResponseDto>>(`${this.balanceMonitorApiUrl}/blockchain/wallets/sample`);
    }

    getBlockchainCurrencyBalance(): Observable<Array<BlockchainWalletCurrencyBalanceResponseDto>> {
        return this.http.get<Array<BlockchainWalletCurrencyBalanceResponseDto>>(`${this.balanceMonitorApiUrl}/blockchain/wallets/currency/balance`);
    }

    getSampleBlockchainCurrencyBalance(): Observable<Array<BlockchainWalletCurrencyBalanceResponseDto>> {
        return this.http.get<Array<BlockchainWalletCurrencyBalanceResponseDto>>(`${this.balanceMonitorApiUrl}/blockchain/wallets/currency/balance/sample`);
    }

    getBlockchainWallet(walletId: string): Observable<BlockchainWalletResponseDto> {
        return this.http.get<BlockchainWalletResponseDto>(`${this.balanceMonitorApiUrl}/blockchain/wallets/${walletId}`);
    }

    addBlockchainWallets(addWalletRequest: Array<AddBlockchainWalletRequestDto>): Observable<string> {
        return this.http.post<string>(`${this.balanceMonitorApiUrl}/blockchain/wallets`, addWalletRequest);
    }

    updateBlockchainWallet(updateWalletRequest: UpdateBlockchainWalletRequestDto): Observable<UpdateBlockchainWalletErrorResponseDto> {
        return this.http.put<UpdateBlockchainWalletErrorResponseDto>(`${this.balanceMonitorApiUrl}/blockchain/wallet`, updateWalletRequest);
    }

    deleteBlockchainWallet(walletAddress: string): Observable<string> {
        return this.http.delete<string>(`${this.balanceMonitorApiUrl}/blockchain/wallet/${walletAddress}`);
    }

    refreshBlockchainWalletsBalance(): Observable<Array<AddBlockchainWalletRequestDto>> {
        return this.http.post<Array<AddBlockchainWalletRequestDto>>(`${this.balanceMonitorApiUrl}/blockchain/wallets/balance/refresh`, null);
    }

    getExchangeWallets(): Observable<ExchangeWalletBalancesResponseDto> {
        return this.http.get<ExchangeWalletBalancesResponseDto>(`${this.balanceMonitorApiUrl}/exchange/wallets`);
    }

    getSampleExchangeWallets(): Observable<ExchangeWalletBalancesResponseDto> {
        return this.http.get<ExchangeWalletBalancesResponseDto>(`${this.balanceMonitorApiUrl}/exchange/wallets/sample`);
    }

    getBalanceSummary(): Observable<BalanceSummaryResponseDto> {
        return this.http.get<BalanceSummaryResponseDto>(`${this.balanceMonitorApiUrl}/balance/summary`);
    }

    getSampleBalanceSummary(): Observable<BalanceSummaryResponseDto> {
        return this.http.get<BalanceSummaryResponseDto>(`${this.balanceMonitorApiUrl}/balance/summary/sample`);
    }

    refreshBalanceSummary(): Observable<BalanceSummaryResponseDto> {
        return this.http.post<BalanceSummaryResponseDto>(`${this.balanceMonitorApiUrl}/balance/summary`, null);
    }

    refreshExchangeWalletsBalance(): Observable<ExchangeWalletBalancesResponseDto> {
        return this.http.post<ExchangeWalletBalancesResponseDto>(`${this.balanceMonitorApiUrl}/exchange/wallets/balance/refresh`, null);
    }

    getUserCurrencyAssetsBalance(): Observable<UserCurrencyAssetsResponseDto> {
        return this.http.get<UserCurrencyAssetsResponseDto>(`${this.balanceMonitorApiUrl}/user-currency-assets`);
    }

    getSampleUserCurrencyAssetsBalance(): Observable<UserCurrencyAssetsResponseDto> {
        return this.http.get<UserCurrencyAssetsResponseDto>(`${this.balanceMonitorApiUrl}/user-currency-assets/sample`);
    }

    deleteUserCurrencyAsset(userCurrencyAssetId: string): Observable<string> {
        return this.http.delete<string>(`${this.balanceMonitorApiUrl}/user-currency-assets/${userCurrencyAssetId}`);
    }

    getUserCurrencyAsset(userCurrencyAssetId: string): Observable<UserCurrencyAssetResponseDto> {
        return this.http.get<UserCurrencyAssetResponseDto>(`${this.balanceMonitorApiUrl}/user-currency-assets/${userCurrencyAssetId}`);
    }

    updateUserCurrencyAsset(updateUserCurrencyAssetRequest: UpdateUserCurrencyAssetRequestDto): Observable<UpdateBlockchainWalletErrorResponseDto> {
        return this.http.put<UpdateBlockchainWalletErrorResponseDto>(`${this.balanceMonitorApiUrl}/user-currency-assets/${updateUserCurrencyAssetRequest.id}`, updateUserCurrencyAssetRequest);
    }

    addUserCurrencyAssets(addUserCurrencyAssetsRequestDtos: Array<AddUserCurrencyAssetRequestDto>): Observable<string> {
        return this.http.post<string>(`${this.balanceMonitorApiUrl}/user-currency-assets`, addUserCurrencyAssetsRequestDtos);
    }

}
