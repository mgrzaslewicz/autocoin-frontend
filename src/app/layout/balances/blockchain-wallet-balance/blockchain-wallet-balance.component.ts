import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../../router.animations';
import {BalanceMonitorService, BlockchainWalletResponseDto, UserCurrencyBalanceResponseDto} from "../../../services/balance-monitor.service";
import {WalletsInputParser} from "./wallets-input-parser";
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
    private lastVisibleMenu: HTMLDivElement = null;
    private walletMenuVisibilityToggleClass = 'wallet-dropdown-menu-visible';

    isRequestPending: boolean = false;
    wallets: BlockchainWalletResponseDto[] = [];
    currencyBalances: UserCurrencyBalanceResponseDto[] = [];

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

    fetchWallets() {
        this.isRequestPending = true;
        this.balanceMonitorService.getBlockchainWallets()
            .subscribe(
                (wallets: Array<BlockchainWalletResponseDto>) => {
                    this.isRequestPending = false;
                    this.wallets = wallets.sort((a, b) => a.currency.localeCompare(b.currency));
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isRequestPending = false;
                    this.toastService.danger('Something went wrong, could not get your wallets');
                }
            );
    }

    fetchCurrencyBalances() {
        this.isRequestPending = true;
        this.balanceMonitorService.getBlockchainCurrencyBalance()
            .subscribe(
                (currencyBalances: UserCurrencyBalanceResponseDto[]) => {
                    this.isRequestPending = false;
                    this.currencyBalances = currencyBalances.sort((a, b) => a.currency.localeCompare(b.currency));
                },
                (error: HttpErrorResponse) => {
                    console.error(error);
                    this.isRequestPending = false;
                    this.toastService.danger('Something went wrong, could not get summary of your wallets');
                }
            );
    }

    goToAddNewWalletView() {
        this.router.navigate(['/balances/wallets/add']);
    }

    refreshWalletsBalance() {
        if (!this.isRequestPending) {
            this.isRequestPending = true;
            this.balanceMonitorService.refreshBlockchainWalletsBalance()
                .subscribe(
                    (response: Array<BlockchainWalletResponseDto>) => {
                        this.wallets = response;
                        this.isRequestPending = false;
                        this.toastService.success('Wallets refreshed');
                    },
                    (error: HttpErrorResponse) => {
                        console.log(error);
                        this.toastService.danger('Something went wrong, could not refresh wallets balance');
                        this.isRequestPending = false;

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
        this.router.navigate([`/balances/wallets/edit/${wallet.id}`]);
    }

    confirmRemoveWallet(hideWalletMenuLayer: HTMLDivElement, yesNoConfirmation: TextDialog, wallet: BlockchainWalletResponseDto) {
        this.hideWalletMenuIfAnyOpen(hideWalletMenuLayer);
        yesNoConfirmation.showYesNoConfirmation('Confirm your action', 'Do you want to remove this wallet address?', () => {
            this.deleteWallet(wallet);
        });
    }

    deleteWallet(wallet: BlockchainWalletResponseDto) {
        if (!this.isRequestPending) {
            this.isRequestPending = true;
            this.balanceMonitorService.deleteBlockchainWallet(wallet.walletAddress)
                .subscribe(
                    () => {
                        this.isRequestPending = false;
                        this.toastService.success('Wallet deleted');
                        this.refreshData();
                    },
                    (error: HttpErrorResponse) => {
                        console.log(error);
                        this.toastService.danger('Something went wrong, could not delete the wallet')
                        this.isRequestPending = false;
                    }
                );
        }
    }

    getTotalUsdBalance(currencyBalances: UserCurrencyBalanceResponseDto[]): number {
        return currencyBalances
            .map(it => Number(it.usdBalance))
            .reduce((acc, val) => acc + val);
    }
}
