import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {routerTransition} from "../../../../router.animations";
import {
    AddBlockchainWalletRequestDto,
    AddBlockchainWalletsErrorResponseDto,
    BalanceMonitorService,
    UpdateBlockchainWalletErrorResponseDto,
    UpdateBlockchainWalletRequestDto,
    BlockchainWalletResponseDto
} from "../../../../services/balance-monitor.service";
import {WalletsInputParser} from "./wallets-input-parser";
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
    currencies = ['BTC', 'ETH'];
    selectedCurrency: string = 'BTC';
    walletsCsvInput: string;
    walletAddressInput: string;
    walletAddressDescriptionInput: string;
    isRequestPending: boolean = false;

    invalidWallets: Array<string> = [];

    isAddingMultipleWallets = false;

    readonly isInUpdateMode: boolean = false;
    private readonly walletId = null;

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
            this.balanceMonitorService.getBlockchainWallet(this.walletId)
                .subscribe(
                    (response: BlockchainWalletResponseDto) => {
                        this.walletAddressInput = response.walletAddress;
                        this.selectedCurrency = response.currency;
                        this.walletAddressDescriptionInput = response.description;
                    },
                    (error: HttpErrorResponse) => {
                        console.error(error);
                        this.toastService.danger('Something went wrong, could not get wallet');
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
            return this.walletsInputParser.linesToDto(this.selectedCurrency, this.walletsCsvInput).length > 0;
        } else {
            return this.walletAddressInput != null && this.walletAddressInput.length > 0;
        }
    }

    addWallets() {
        if (!this.isRequestPending && this.areAddWalletsInputValid()) {
            this.isRequestPending = true;
            let addWalletsRequest: Array<AddBlockchainWalletRequestDto> = [];
            if (this.isAddingMultipleWallets) {
                addWalletsRequest = this.walletsInputParser.linesToDto(this.selectedCurrency, this.walletsCsvInput);
            } else {
                addWalletsRequest.push({
                    walletAddress: this.walletAddressInput,
                    currency: this.selectedCurrency,
                    description: this.walletAddressDescriptionInput
                } as AddBlockchainWalletRequestDto);
            }
            const requestContainsMultipleWallets = addWalletsRequest.length > 1;
            this.balanceMonitorService.addBlockchainWallets(addWalletsRequest)
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
                            const addWalletsErrorResponseDto: AddBlockchainWalletsErrorResponseDto = error.error as AddBlockchainWalletsErrorResponseDto;
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
                            this.toastService.danger('Something went wrong, could not add wallets');
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
            const updateWalletsRequest: UpdateBlockchainWalletRequestDto = {
                id: this.walletId,
                walletAddress: this.walletAddressInput,
                currency: this.selectedCurrency,
                description: this.walletAddressDescriptionInput
            } as UpdateBlockchainWalletRequestDto;
            this.balanceMonitorService.updateBlockchainWallet(updateWalletsRequest)
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
                            const updateWalletErrorResponseDto: UpdateBlockchainWalletErrorResponseDto = error.error as UpdateBlockchainWalletErrorResponseDto;
                            if (updateWalletErrorResponseDto.isAddressInvalid) {
                                this.toastService.warning('Wallet was not saved because given address is not a valid blockchain address');
                            } else if (updateWalletErrorResponseDto.isAddressDuplicated) {
                                this.toastService.warning('Wallet was not saved because given address is already existing in your wallets');
                            } else if (updateWalletErrorResponseDto.isIdInvalid) {
                                this.toastService.warning('Wallet was not saved because given address is already existing in your wallets');
                            }
                        } else {
                            this.toastService.danger('Something went wrong, could not save wallet');
                        }
                    }
                );
        }
    }

    getSampleWalletAddress(): string {
        switch (this.selectedCurrency) {
            case 'BTC':
                return 'bc1qhxycdau56zv7duqm020lllahjxzam8ypvmavgu'
                break;
            case 'ETH':
                return '0x445c9d791b782a7b181194950e0c0ee8c14468f1';
                break;
        }
    }
}
