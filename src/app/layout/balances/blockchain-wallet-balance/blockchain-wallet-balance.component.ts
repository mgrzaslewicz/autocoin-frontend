import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../../router.animations';
import {
    BalanceMonitorService,
    BlockchainWalletCurrencyBalanceResponseDto,
    BlockchainWalletResponseDto
} from "../../../services/balance-monitor.service";
import {WalletsInputParser} from "./edit/wallets-input-parser";
import {ToastService} from "../../../services/toast.service";
import {HttpErrorResponse} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {TextDialog} from "../../../dialog/text-dialog";
import {Router} from "@angular/router";


@Component({
    selector: 'app-blockchain-wallet-balance',
    templateUrl: './blockchain-wallet-balance.component.html',
    styleUrls: ['./blockchain-wallet-balance.component.scss'],
    animations: [
        routerTransition(),
        trigger('addWalletAnimation', [
            state('visible', style({
                height: '*',
                overflow: 'hidden'
            })),
            state('hidden', style({
                height: '0',
                overflow: 'hidden'
            })),
            transition('visible => hidden', animate('100ms ease-in-out')),
            transition('hidden => visible', animate('100ms ease-in-out'))
        ])
    ]
})
export class BlockchainWalletBalanceComponent implements OnInit {
    isFetchWalletsRequestPending: boolean = false;
    isFetchCurrencyBalancesRequestPending: boolean = false;
    wallets: BlockchainWalletResponseDto[] = [];
    currencyBalances: BlockchainWalletCurrencyBalanceResponseDto[] = [];
    shouldShowSampleWalletProposal: boolean = false;
    isShowingSampleWallet: boolean = false;

    private lastVisibleMenu: HTMLDivElement = null;
    private walletMenuVisibilityToggleClass = 'wallet-dropdown-menu-visible';
    private totalUsdValue: number;

    constructor(private balanceMonitorService: BalanceMonitorService,
                private walletsInputParser: WalletsInputParser,
                private toastService: ToastService,
                private router: Router) {
    }

    ngOnInit() {
        this.refreshData();
    }

    refreshData() {
        this.fetchWallets();
        this.fetchCurrencyBalances();
    }

    showSampleWallets() {
        this.shouldShowSampleWalletProposal = false;
        this.fetchSampleWallets();
        this.fetchSampleCurrencyBalances();
    }

    fetchSampleWallets() {
        this.balanceMonitorService.getSampleBlockchainWallets()
            .subscribe(
                (wallets: Array<BlockchainWalletResponseDto>) => {
                    this.isShowingSampleWallet = true;
                    this.isFetchWalletsRequestPending = false;
                    this.wallets = wallets.sort((a, b) => a.currency.localeCompare(b.currency));
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isFetchWalletsRequestPending = false;
                    this.toastService.danger('Something went wrong, could not get your wallets');
                }
            )
    }

    fetchWallets() {
        this.isFetchWalletsRequestPending = true;
        this.balanceMonitorService.getBlockchainWallets()
            .subscribe(
                (wallets: Array<BlockchainWalletResponseDto>) => {
                    if (wallets.length == 0) {
                        this.shouldShowSampleWalletProposal = true;
                    }
                    this.isFetchWalletsRequestPending = false;
                    this.wallets = wallets.sort((a, b) => a.currency.localeCompare(b.currency));
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isFetchWalletsRequestPending = false;
                    this.toastService.danger('Something went wrong, could not get your wallets');
                }
            );
    }

    fetchCurrencyBalances() {
        this.isFetchCurrencyBalancesRequestPending = true;
        this.balanceMonitorService.getBlockchainCurrencyBalance()
            .subscribe(
                (currencyBalances: BlockchainWalletCurrencyBalanceResponseDto[]) => {
                    this.isFetchCurrencyBalancesRequestPending = false;
                    this.onNewCurrencyBalances(currencyBalances);
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isFetchCurrencyBalancesRequestPending = false;
                    this.toastService.danger('Something went wrong, could not get summary of your wallets');
                }
            );
    }

    private onNewCurrencyBalances(currencyBalances: BlockchainWalletCurrencyBalanceResponseDto[]) {
        this.currencyBalances = currencyBalances.sort((a, b) => a.currency.localeCompare(b.currency));
        this.totalUsdValue = this.getTotalUsdValue(this.currencyBalances);
    }

    fetchSampleCurrencyBalances() {
        this.isFetchCurrencyBalancesRequestPending = true;
        this.balanceMonitorService.getSampleBlockchainCurrencyBalance()
            .subscribe(
                (currencyBalances: BlockchainWalletCurrencyBalanceResponseDto[]) => {
                    this.isFetchCurrencyBalancesRequestPending = false;
                    this.onNewCurrencyBalances(currencyBalances);
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isFetchCurrencyBalancesRequestPending = false;
                    this.toastService.danger('Something went wrong, could not get summary of your wallets');
                }
            );
    }

    getUsdValuePercent(currencyBalance: BlockchainWalletCurrencyBalanceResponseDto): number {
        return Number(currencyBalance.usdBalance) * 100 / this.totalUsdValue;
    }

    private getTotalUsdValue(currencyBalances: BlockchainWalletCurrencyBalanceResponseDto[]): number {
        if (currencyBalances.length == 0) {
            return 0;
        } else {
            return currencyBalances
                .map(it => Number(it.usdBalance))
                .reduce((acc, val) => acc + val);
        }
    }

    goToAddNewWalletView() {
        this.router.navigate(['/balances/wallets/add']);
    }

    refreshWalletsBalance() {
        if (!this.isFetchWalletsRequestPending) {
            this.isFetchWalletsRequestPending = true;
            this.balanceMonitorService.refreshBlockchainWalletsBalance()
                .subscribe(
                    (response: Array<BlockchainWalletResponseDto>) => {
                        this.wallets = response;
                        this.isFetchWalletsRequestPending = false;
                        this.toastService.success('Wallets refreshed');
                    },
                    (error: HttpErrorResponse) => {
                        console.log(error);
                        this.toastService.danger('Something went wrong, could not refresh wallets balance');
                        this.isFetchWalletsRequestPending = false;

                    }
                )
        }
    }

    toggleWalletMenuVisibility(menu: HTMLDivElement, hideWalletMenuLayer: HTMLDivElement) {
        if (this.lastVisibleMenu != null) {
            const lastVisibleMenuWalletAddress = this.lastVisibleMenu.getAttribute('wallet-address');
            const currentMenuWalletAddress = menu.getAttribute('wallet-address');
            if (lastVisibleMenuWalletAddress != currentMenuWalletAddress) {
                this.lastVisibleMenu.classList.remove(this.walletMenuVisibilityToggleClass);
            }
        }
        if (menu.classList.contains(this.walletMenuVisibilityToggleClass)) {
            menu.classList.remove(this.walletMenuVisibilityToggleClass);
            hideWalletMenuLayer.classList.add('d-none');
        } else {
            menu.classList.add(this.walletMenuVisibilityToggleClass);
            this.lastVisibleMenu = menu;
            hideWalletMenuLayer.classList.remove('d-none');
        }
    }

    hideWalletMenuIfAnyOpen(hideWalletMenuLayer: HTMLDivElement) {
        if (this.lastVisibleMenu != null) {
            this.lastVisibleMenu.classList.remove(this.walletMenuVisibilityToggleClass);
            this.lastVisibleMenu = null;
            hideWalletMenuLayer.classList.add('d-none');
        }
    }

    editWallet(wallet: BlockchainWalletResponseDto) {
        if (!this.isShowingSampleWallet) {
            this.router.navigate([`/balances/wallets/edit/${wallet.id}`]);
        }
    }

    confirmRemoveWallet(hideWalletMenuLayer: HTMLDivElement, yesNoConfirmation: TextDialog, wallet: BlockchainWalletResponseDto) {
        this.hideWalletMenuIfAnyOpen(hideWalletMenuLayer);
        if (!this.isShowingSampleWallet) {
            yesNoConfirmation.showYesNoConfirmation('Confirm your action', 'Do you want to remove this wallet address?', () => {
                this.deleteWallet(wallet);
            });
        }
    }

    deleteWallet(wallet: BlockchainWalletResponseDto) {
        if (!this.isFetchWalletsRequestPending) {
            this.isFetchWalletsRequestPending = true;
            this.balanceMonitorService.deleteBlockchainWallet(wallet.walletAddress)
                .subscribe(
                    () => {
                        this.isFetchWalletsRequestPending = false;
                        this.toastService.success('Wallet deleted');
                        this.refreshData();
                    },
                    (error: HttpErrorResponse) => {
                        console.log(error);
                        this.toastService.danger('Something went wrong, could not delete the wallet')
                        this.isFetchWalletsRequestPending = false;
                    }
                );
        }
    }

    getTotalUsdBalance(currencyBalances: BlockchainWalletCurrencyBalanceResponseDto[]): number {
        if (currencyBalances.length == 0) {
            return 0;
        } else {
            return currencyBalances
                .map(it => Number(it.usdBalance))
                .reduce((acc, val) => acc + val);
        }
    }
}
