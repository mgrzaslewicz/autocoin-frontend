import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../../router.animations';
import {AddWalletRequestDto, AddWalletsErrorResponseDto, BalanceMonitorService, WalletResponseDto} from "../../../services/balance-monitor.service";
import {WalletsInputParser} from "./wallets-input-parser";
import {ToastService} from "../../../services/toast.service";
import {HttpErrorResponse} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {TextDialog} from "../../../dialog/text-dialog";


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
    currencyInput: string = 'ETH';
    walletsInput: string;
    isRequestPending: boolean = false;

    invalidWallets: Array<string> = [];

    wallets: Array<WalletResponseDto> = [];

    addWalletCardVisibility = 'hidden';
    isAddWalletCardVisible: boolean = false;

    private lastVisibleMenu: HTMLDivElement = null;
    private walletMenuVisibilityToggleClass = 'wallet-dropdown-menu-visible';

    constructor(private balanceMonitorService: BalanceMonitorService,
                private walletsInputParser: WalletsInputParser,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.fetchWallets();
    }

    private clearInputs() {
        this.walletsInput = '';
    }

    addWallets() {
        if (!this.isRequestPending) {
            const addWalletsRequest = this.walletsInputParser.linesToDto(this.currencyInput, this.walletsInput);
            if (addWalletsRequest.length == 0) {
                this.toastService.warning('Invalid wallets input');
            } else {
                this.isRequestPending = true;
                this.balanceMonitorService.addWallets(addWalletsRequest)
                    .subscribe(
                        () => {
                            this.clearInputs();
                            this.isRequestPending = false;
                            this.fetchWallets();
                            this.toastService.success('Wallets added');
                        },
                        (error: HttpErrorResponse) => {
                            this.isRequestPending = false;
                            console.log(error);
                            if (error.status == 400) {
                                const addWalletsErrorResponseDto: AddWalletsErrorResponseDto = error.error as AddWalletsErrorResponseDto;
                                this.invalidWallets = addWalletsErrorResponseDto.invalidAddresses;
                                if (addWalletsErrorResponseDto.duplicatedAddresses.length > 0) {
                                    this.toastService.warning('Some addresses were skipped as already existing in your wallets')
                                }
                                this.clearInputs();
                            } else {
                                this.toastService.warning('Something went wrong, could not add wallets')
                            }
                            this.fetchWallets();
                        }
                    );
            }
        }
    }

    private fetchWallets() {
        this.isRequestPending = true;
        this.balanceMonitorService.getWallets()
            .subscribe(
                (wallets: Array<WalletResponseDto>) => {
                    this.isRequestPending = false;
                    this.wallets = wallets;
                    console.log(wallets);
                },
                error => {
                    this.isRequestPending = false;
                }
            );
    }

    toggleAddWalletsVisibility() {
        this.addWalletCardVisibility = this.addWalletCardVisibility === 'hidden' ? 'visible' : 'hidden';
        this.isAddWalletCardVisible = !this.isAddWalletCardVisible;
    }

    refreshWalletsBalance() {
        if (!this.isRequestPending) {
            this.isRequestPending = true;
            this.balanceMonitorService.refreshWalletsBalance()
                .subscribe(
                    (response: Array<AddWalletRequestDto>) => {
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

    editWallet(wallet: WalletResponseDto) {

    }

    confirmRemoveWallet(hideWalletMenuLayer: HTMLDivElement, yesNoConfirmation: TextDialog, wallet: WalletResponseDto) {
        this.hideWalletMenuIfAnyOpen(hideWalletMenuLayer);
        yesNoConfirmation.showYesNoConfirmation('Confirm your action', 'Do you want to remove this wallet address?', () => {
            this.deleteWallet(wallet);
        });
    }

    deleteWallet(wallet: WalletResponseDto) {
        if (!this.isRequestPending) {
            this.isRequestPending = true;
            this.balanceMonitorService.deleteWallet(wallet.walletAddress)
                .subscribe(
                    () => {
                        this.isRequestPending = false;
                        this.toastService.success('Wallet deleted');
                        this.fetchWallets();
                    },
                    (error: HttpErrorResponse) => {
                        console.log(error);
                        this.toastService.danger('Something went wrong, could not delete the wallet')
                        this.isRequestPending = false;
                    }
                );
        }
    }
}
