import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {routerTransition} from "../../../../router.animations";
import {AddWalletRequestDto, AddWalletsErrorResponseDto, BalanceMonitorService, WalletResponseDto} from "../../../../services/balance-monitor.service";
import {WalletsInputParser} from "../wallets-input-parser";
import {ToastService} from "../../../../services/toast.service";
import {TextDialog} from "../../../../dialog/text-dialog";
import {Router} from "@angular/router";


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

    constructor(private balanceMonitorService: BalanceMonitorService,
                private walletsInputParser: WalletsInputParser,
                private toastService: ToastService,
                private router: Router) {
    }

    ngOnInit() {
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
                        console.log(error);
                        if (error.status == 400) {
                            const addWalletsErrorResponseDto: AddWalletsErrorResponseDto = error.error as AddWalletsErrorResponseDto;
                            this.invalidWallets = addWalletsErrorResponseDto.invalidAddresses;
                            if (addWalletsErrorResponseDto.duplicatedAddresses.length > 0) {
                                if (requestContainsMultipleWallets) {
                                    this.toastService.warning('Some addresses were skipped as already existing in your wallets')
                                } else {
                                    this.toastService.warning('Address was skipped as already existing in your wallets')
                                }
                            }
                            this.clearInputs();
                        } else {
                            this.toastService.warning('Something went wrong, could not add wallets')
                        }
                        this.goBackToWalletsView();
                    }
                );
        }
    }

    private

    goBackToWalletsView() {
        this.router.navigate(['/balances/wallets']);
    }

    toggleAddSingleWalletForm() {
        this.isAddingMultipleWallets = !this.isAddingMultipleWallets;
    }

}
