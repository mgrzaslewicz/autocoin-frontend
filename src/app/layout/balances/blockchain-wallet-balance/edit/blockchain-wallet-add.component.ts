import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {routerTransition} from "../../../../router.animations";
import {
    AddWalletRequestDto,
    AddWalletsErrorResponseDto,
    BalanceMonitorService,
    UpdateWalletErrorResponseDto,
    UpdateWalletRequestDto,
    WalletResponseDto
} from "../../../../services/balance-monitor.service";
import {WalletsInputParser} from "../wallets-input-parser";
import {ToastService} from "../../../../services/toast.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
    selector: 'app-blockchain-wallet-add',
    templateUrl: './blockchain-wallet-add.component.html',
    styleUrls: ['./blockchain-wallet-add.component.scss'],
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
export class BlockchainWalletAddComponent implements OnInit {
    currencyInput: string = 'ETH';
    walletsCsvInput: string;
    walletAddressInput: string;
    walletAddressDescriptionInput: string;
    isRequestPending: boolean = false;

    invalidWallets: Array<string> = [];

    isAddingMultipleWallets = false;

    isInUpdateMode: boolean = false;
    private walletId = null;

    constructor(private balanceMonitorService: BalanceMonitorService,
                private walletsInputParser: WalletsInputParser,
                private toastService: ToastService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
        this.walletId = this.activatedRoute.snapshot.paramMap.get('walletId');
        this.isInUpdateMode = this.walletId != null;
    }

    ngOnInit() {
        if (this.isInUpdateMode) {
            this.balanceMonitorService.getWallet(this.walletId)
                .subscribe(
                    (response: WalletResponseDto) => {
                        this.walletAddressInput = response.walletAddress;
                        this.currencyInput = response.currency;
                        this.walletAddressDescriptionInput = response.description;
                    },
                    (error: HttpErrorResponse) => {
                        console.error(error);
                        this.toastService.warning('Something went wrong, could not get wallet');
                    }
                );
        }
    }

    private clearInputs() {
        this.walletsCsvInput = '';
        this.walletAddressDescriptionInput = '';
        this.walletAddressInput = '';
    }

    areAddWalletsInputValid(): boolean {
        if (this.isAddingMultipleWallets) {
            return this.walletsInputParser.linesToDto(this.currencyInput, this.walletsCsvInput).length > 0;
        } else {
            return this.walletAddressInput != null && this.walletAddressInput.length > 0;
        }
    }

    addWallets() {
        if (!this.isRequestPending && this.areAddWalletsInputValid()) {
            this.isRequestPending = true;
            let addWalletsRequest: Array<AddWalletRequestDto> = [];
            if (this.isAddingMultipleWallets) {
                addWalletsRequest = this.walletsInputParser.linesToDto(this.currencyInput, this.walletsCsvInput);
            } else {
                addWalletsRequest.push({
                    walletAddress: this.walletAddressInput,
                    currency: this.currencyInput,
                    description: this.walletAddressDescriptionInput
                } as AddWalletRequestDto);
            }
            const requestContainsMultipleWallets = addWalletsRequest.length > 1;
            this.balanceMonitorService.addWallets(addWalletsRequest)
                .subscribe(
                    () => {
                        this.clearInputs();
                        this.isRequestPending = false;
                        this.goBackToWalletsView();
                        this.toastService.success('Wallets added');
                    },
                    (error: HttpErrorResponse) => {
                        this.isRequestPending = false;
                        console.error(error);
                        if (error.status == 400) {
                            const addWalletsErrorResponseDto: AddWalletsErrorResponseDto = error.error as AddWalletsErrorResponseDto;
                            this.invalidWallets = addWalletsErrorResponseDto.invalidAddresses;
                            if (addWalletsErrorResponseDto.duplicatedAddresses.length > 0) {
                                if (requestContainsMultipleWallets) {
                                    this.toastService.warning('Some addresses were skipped as already existing in your wallets');
                                } else {
                                    this.toastService.warning('Address was skipped as already existing in your wallets');
                                }
                            }
                            if (this.invalidWallets.length == 0) {
                                this.goBackToWalletsView();
                            }
                        } else {
                            this.toastService.warning('Something went wrong, could not add wallets');
                        }
                    }
                );
        }
    }

    goBackToWalletsView() {
        this.router.navigate(['/balances/wallets']);
    }

    toggleAddSingleWalletForm() {
        this.isAddingMultipleWallets = !this.isAddingMultipleWallets;
    }

    saveWallet() {
        if (!this.isRequestPending && this.areAddWalletsInputValid()) {
            this.isRequestPending = true;
            const updateWalletsRequest: UpdateWalletRequestDto = {
                id: this.walletId,
                walletAddress: this.walletAddressInput,
                currency: this.currencyInput,
                description: this.walletAddressDescriptionInput
            } as UpdateWalletRequestDto;
            this.balanceMonitorService.updateWallet(updateWalletsRequest)
                .subscribe(
                    () => {
                        this.clearInputs();
                        this.isRequestPending = false;
                        this.goBackToWalletsView();
                        this.toastService.success('Wallet saved');
                    },
                    (error: HttpErrorResponse) => {
                        this.isRequestPending = false;
                        console.error(error);
                        if (error.status == 400) {
                            const updateWalletErrorResponseDto: UpdateWalletErrorResponseDto = error.error as UpdateWalletErrorResponseDto;
                            if (updateWalletErrorResponseDto.isAddressInvalid) {
                                this.toastService.warning('Wallet was not saved because given address is not a valid blockchain address');
                            } else if (updateWalletErrorResponseDto.isAddressDuplicated) {
                                this.toastService.warning('Wallet was not saved because given address is already existing in your wallets');
                            } else if (updateWalletErrorResponseDto.isIdInvalid) {
                                this.toastService.warning('Wallet was not saved because given address is already existing in your wallets');
                            }
                        } else {
                            this.toastService.warning('Something went wrong, could not save wallet');
                        }
                    }
                );
        }
    }
}
