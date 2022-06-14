import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../../router.animations';
import {AddWalletsErrorResponseDto, BalanceMonitorService, WalletResponseDto} from "../../../services/balance-monitor.service";
import {WalletsInputParser} from "./wallets-input-parser";
import {ToastService} from "../../../services/toast.service";
import {HttpErrorResponse} from "@angular/common/http";
import {animate, state, style, transition, trigger} from "@angular/animations";


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

}
