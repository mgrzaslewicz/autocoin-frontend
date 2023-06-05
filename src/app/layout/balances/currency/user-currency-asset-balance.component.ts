import {Component, OnInit} from '@angular/core';
import {
    BalanceMonitorService,
    HasPriceInOtherCurrency,
    HasValueInOtherCurrency,
    UserCurrencyAssetResponseDto,
    UserCurrencyAssetsResponseDto,
    UserCurrencyAssetSummaryResponseDto
} from "../../../services/balance-monitor.service";
import {ToastService} from "../../../services/toast.service";
import {HttpErrorResponse} from "@angular/common/http";
import {TextDialog} from "../../../dialog/text-dialog";
import {Router} from "@angular/router";


@Component({
    selector: 'app-user-currency-asset-balance',
    templateUrl: './user-currency-asset-balance.component.html',
    styleUrls: ['./user-currency-asset-balance.component.scss']
})
export class UserCurrencyAssetBalanceComponent implements OnInit {
    isFetchUserCurrenciesRequestPending: boolean = false;
    isFetchCurrencyBalancesRequestPending: boolean = false;
    summarizedUserCurrencyBalances: UserCurrencyAssetSummaryResponseDto[] = [];
    userCurrencyAssets: UserCurrencyAssetResponseDto[] = [];
    shouldShowSampleWalletAssetProposal: boolean = false;
    isShowingSampleWalletAsset: boolean = false;

    private lastVisibleMenu: HTMLDivElement = null;
    private dropDownMenuVisibilityToggleClass = 'user-currency-asset-dropdown-menu-visible';
    private totalUsdValue: number;

    constructor(private balanceMonitorService: BalanceMonitorService,
                private toastService: ToastService,
                private router: Router) {
    }

    ngOnInit() {
        this.fetchUserCurrencies();
    }

    private onUserCurrencyAssetsFetched(userCurrencyAssetsResponseDto: UserCurrencyAssetsResponseDto) {
        this.isFetchCurrencyBalancesRequestPending = false;
        this.userCurrencyAssets = userCurrencyAssetsResponseDto.userCurrencyAssets.sort((a, b) => a.currency.localeCompare(b.currency));
        this.summarizedUserCurrencyBalances = userCurrencyAssetsResponseDto.userCurrencyAssetsSummary.sort((a, b) => a.currency.localeCompare(b.currency));
        this.totalUsdValue = this.getTotalUsdValue(this.summarizedUserCurrencyBalances);
    }

    showSampleWalletAsset() {
        this.isFetchCurrencyBalancesRequestPending = true;
        this.balanceMonitorService.getSampleUserCurrencyAssetsBalance()
            .subscribe(
                (response: UserCurrencyAssetsResponseDto) => {
                    this.onUserCurrencyAssetsFetched(response);
                    this.isShowingSampleWalletAsset = true;
                    this.shouldShowSampleWalletAssetProposal = false;
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isFetchCurrencyBalancesRequestPending = false;
                    this.toastService.danger('Something went wrong, could not get your currency assets');
                }
            );
    }

    fetchUserCurrencies() {
        this.isFetchCurrencyBalancesRequestPending = true;
        this.balanceMonitorService.getUserCurrencyAssetsBalance()
            .subscribe(
                (response: UserCurrencyAssetsResponseDto) => {
                    this.onUserCurrencyAssetsFetched(response);
                    this.shouldShowSampleWalletAssetProposal = this.userCurrencyAssets.length === 0;
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isFetchCurrencyBalancesRequestPending = false;
                    this.toastService.danger('Something went wrong, could not get your currency assets');
                }
            );
    }

    goToAddNewUserCurrencyAssetView() {
        this.router.navigate(['/balances/currency-assets/add']);
    }

    toggleUserCurrencyMenuVisibility(menu: HTMLDivElement, hideWalletMenuLayer: HTMLDivElement) {
        if (this.lastVisibleMenu != null) {
            const lastVisibleMenuWalletAddress = this.lastVisibleMenu.getAttribute('user-currency-id');
            const currentMenuWalletAddress = menu.getAttribute('user-currency-id');
            if (lastVisibleMenuWalletAddress != currentMenuWalletAddress) {
                this.lastVisibleMenu.classList.remove(this.dropDownMenuVisibilityToggleClass);
            }
        }
        if (menu.classList.contains(this.dropDownMenuVisibilityToggleClass)) {
            menu.classList.remove(this.dropDownMenuVisibilityToggleClass);
            hideWalletMenuLayer.classList.add('d-none');
        } else {
            menu.classList.add(this.dropDownMenuVisibilityToggleClass);
            this.lastVisibleMenu = menu;
            hideWalletMenuLayer.classList.remove('d-none');
        }
    }

    hideUserCurrencyMenuIfAnyOpen(hideWalletMenuLayer: HTMLDivElement) {
        if (this.lastVisibleMenu != null) {
            this.lastVisibleMenu.classList.remove(this.dropDownMenuVisibilityToggleClass);
            this.lastVisibleMenu = null;
            hideWalletMenuLayer.classList.add('d-none');
        }
    }

    editUserCurrency(userCurrency: UserCurrencyAssetResponseDto) {
        this.router.navigate([`/balances/currency-assets/edit/${userCurrency.id}`]);
    }

    confirmRemoveUserCurrency(hideWalletMenuLayer: HTMLDivElement, yesNoConfirmation: TextDialog, userCurrency: UserCurrencyAssetResponseDto) {
        this.hideUserCurrencyMenuIfAnyOpen(hideWalletMenuLayer);
        yesNoConfirmation.showYesNoConfirmation('Confirm your action', 'Do you want to remove this wallet address?', () => {
            this.deleteUserCurrency(userCurrency);
        });
    }

    deleteUserCurrency(userCurrency: UserCurrencyAssetResponseDto) {
        if (!this.isFetchUserCurrenciesRequestPending) {
            this.isFetchUserCurrenciesRequestPending = true;
            this.balanceMonitorService.deleteUserCurrencyAsset(userCurrency.id)
                .subscribe(
                    () => {
                        this.isFetchUserCurrenciesRequestPending = false;
                        this.toastService.success('Wallet deleted');
                        this.fetchUserCurrencies();
                    },
                    (error: HttpErrorResponse) => {
                        console.log(error);
                        this.toastService.danger('Something went wrong, could not delete the wallet')
                        this.isFetchUserCurrenciesRequestPending = false;
                    }
                );
        }
    }

    getTotalUsdBalance(items: HasValueInOtherCurrency[]): number {
        if (items.length === 0) {
            return 0;
        } else {
            return items
                .map(it => Number(it.valueInOtherCurrency['USD']))
                .reduce((acc, val) => acc + val);
        }
    }

    hasUsdValue(it: HasValueInOtherCurrency): boolean {
        return it.valueInOtherCurrency['USD'] != null;
    }

    getUsdValue(it: HasValueInOtherCurrency): number {
        return Number(it.valueInOtherCurrency['USD']);
    }

    hasUsdPrice(it: HasPriceInOtherCurrency): boolean {
        return it.priceInOtherCurrency['USD'] != null;
    }

    getUsdPrice(it: HasPriceInOtherCurrency): number {
        return Number(it.priceInOtherCurrency['USD']);
    }

    private getTotalUsdValue(currencyBalances: HasValueInOtherCurrency[]): number {
        if (currencyBalances.length === 0) {
            return 0;
        } else {
            return currencyBalances
                .map(it => Number(it.valueInOtherCurrency['USD']))
                .reduce((acc, val) => acc + val);
        }
    }

    getUsdValuePercent(currencyBalance: HasValueInOtherCurrency): number {
        return Number(currencyBalance.valueInOtherCurrency['USD']) * 100 / this.totalUsdValue;
    }

}
