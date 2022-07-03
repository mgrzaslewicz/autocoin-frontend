import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {AddUserCurrencyAssetRequestDto, BalanceMonitorService, UpdateUserCurrencyAssetRequestDto, UserCurrencyAssetResponseDto} from "../../../../services/balance-monitor.service";
import {ToastService} from "../../../../services/toast.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CurrencyAssetsInputParser} from "./currency-assets-input-parser.service";


@Component({
    selector: 'app-user-currency-asset-add',
    templateUrl: './user-currency-asset-add.component.html',
    styleUrls: ['./user-currency-asset-add.component.scss']
})
export class UserCurrencyAssetAddComponent implements OnInit {
    currencyCsvInput: string;
    currencyInput: string;
    userCurrencyDescriptionInput: string;
    userCurrencyBalanceInput: string;
    isRequestPending: boolean = false;

    isAddingMultipleCurrencies = false;

    readonly isInUpdateMode: boolean = false;
    private readonly userCurrencyId = null;

    constructor(private balanceMonitorService: BalanceMonitorService,
                private currencyInputParser: CurrencyAssetsInputParser,
                private toastService: ToastService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
        this.userCurrencyId = this.activatedRoute.snapshot.paramMap.get('userCurrencyAssetId');
        this.isInUpdateMode = this.userCurrencyId != null;
    }

    ngOnInit() {
        if (this.isInUpdateMode) {
            this.balanceMonitorService.getUserCurrencyAsset(this.userCurrencyId)
                .subscribe(
                    (response: UserCurrencyAssetResponseDto) => {
                        this.currencyInput = response.currency;
                        this.userCurrencyDescriptionInput = response.description;
                        this.userCurrencyBalanceInput = response.balance;
                    },
                    (error: HttpErrorResponse) => {
                        console.error(error);
                        this.toastService.danger('Something went wrong, could not get currency asset');
                    }
                );
        }
    }

    private clearInputs() {
        this.currencyCsvInput = '';
        this.userCurrencyDescriptionInput = '';
        this.currencyInput = '';
    }

    goBackToUserCurrencyBalancesView() {
        this.router.navigate(['/balances/currency-assets']);
    }

    addUserCurrencies() {
        if (!this.isRequestPending && this.areAddCurrenciesInputsValid()) {
            this.isRequestPending = true;
            let addRequestDtos: Array<AddUserCurrencyAssetRequestDto> = [];
            if (this.isAddingMultipleCurrencies) {
                addRequestDtos = this.currencyInputParser.linesToDtos(this.currencyCsvInput);
            } else {
                addRequestDtos.push({
                    currency: this.currencyInput,
                    balance: this.userCurrencyBalanceInput,
                    description: this.userCurrencyDescriptionInput
                } as AddUserCurrencyAssetRequestDto);
            }
            this.balanceMonitorService.addUserCurrencyAssets(addRequestDtos)
                .subscribe(
                    () => {
                        this.clearInputs();
                        this.isRequestPending = false;
                        this.goBackToUserCurrencyBalancesView();
                        this.toastService.success('Currency assets added');
                    },
                    (error: HttpErrorResponse) => {
                        this.isRequestPending = false;
                        console.error(error);
                        this.toastService.danger('Something went wrong, could not add currency assets');
                    }
                );
        }
    }

    areAddCurrenciesInputsValid(): boolean {
        if (this.isAddingMultipleCurrencies) {
            return this.currencyInputParser.linesToDtos(this.currencyCsvInput).length > 0;
        } else {
            return (this.currencyInput?.length > 0 ?? false)
                && Number(this.userCurrencyBalanceInput) > 0 && (this.userCurrencyBalanceInput?.indexOf(',') == -1 ?? true);
        }
    }

    saveUserCurrency() {
        if (!this.isRequestPending && this.areAddCurrenciesInputsValid()) {
            this.isRequestPending = true;
            const updateUserCurrencyRequest: UpdateUserCurrencyAssetRequestDto = {
                id: this.userCurrencyId,
                currency: this.currencyInput,
                description: this.userCurrencyDescriptionInput,
                balance: this.userCurrencyBalanceInput
            } as UpdateUserCurrencyAssetRequestDto;
            this.balanceMonitorService.updateUserCurrencyAsset(updateUserCurrencyRequest)
                .subscribe(
                    () => {
                        this.clearInputs();
                        this.isRequestPending = false;
                        this.goBackToUserCurrencyBalancesView();
                        this.toastService.success('Wallet saved');
                    },
                    (error: HttpErrorResponse) => {
                        this.isRequestPending = false;
                        console.error(error);
                        this.toastService.danger('Something went wrong, could not save currency asset');
                    }
                );
        }
    }

    toggleAddSingleCurrencyForm() {
        this.isAddingMultipleCurrencies = !this.isAddingMultipleCurrencies;
    }

}
