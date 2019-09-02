import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ExchangeUser} from '../../../models';
import {ExchangeUsersService} from '../../../services/api';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../services/toast.service';
import {
    Strategy,
    StrategyBuyParametersDto,
    StrategyExecutionResponseDto,
    StrategyParametersRequestDto,
    StrategySellParametersDto
} from '../../../models/strategy';
import {BuyLowerAndLowerSpecificParametersComponent} from './buy-lower-and-lower-specific-parameters/buy-lower-and-lower-specific-parameters.component';
import {FEATURE_CREATE_STRATEGY, FeatureToggle, FeatureToggleToken} from '../../../services/feature.toogle.service';
import {SellHigherAndHigherSpecificParametersComponent} from './sell-higher-and-higher-specific-parameters/sell-higher-and-higher-specific-parameters.component';
import {SellWhenSecondCurrencyGrowsParametersComponent} from './sell-when-second-currency-grows-parameters/sell-when-second-currency-grows-parameters.component';
import {SellNowParametersComponent} from './sell-now-parameters/sell-now-parameters.component';
import {BuyNowParametersComponent} from './buy-now-parameters/buy-now-parameters.component';
import {WithMessageDto} from '../../../services/api/withMessageDto';
import {StrategiesService} from '../../../services/trading-automation/strategies.service';
import {StrategiesExecutionsService} from '../../../services/trading-automation/strategies-executions.service';

export interface ExchangeUserSelection {
    exchangeUser: ExchangeUser;
    checked: boolean;
}

@Component({
    selector: 'app-add-strategy-execution',
    templateUrl: './add-strategy-execution.component.html',
    styleUrls: ['./add-strategy-execution.component.scss']
})
export class AddStrategyExecutionComponent implements OnInit {

    public exchangeName;
    public currencyPair: string;
    public exchangeUserSelectionList: ExchangeUserSelection[] = [];
    public strategies: Strategy[];
    public selectedStrategyName = 'BuyLowerAndLower';
    public counterCurrencyPercentLimitForBuying = 20;
    public counterCurrencyAmountLimitForBuying = 0;
    public baseCurrencyPercentLimitForSelling = 20;
    public baseCurrencyAmountLimitForSelling = 0;
    public counterCurrencyPercentForBuyingPerOrder = 50;
    public baseCurrencyPercentForSellingPerOrder = 50;
    public strategySpecificParameters: any;
    public creatingStrategiesInProgress = false;
    public finishedCreatingStrategies = false;
    public strategiesNotCreatedFor: string[] = [];
    public strategiesCreatedFor: string[] = [];

    public isUsingNoCounterCurrencyLimit = false;
    public isUsingCounterCurrencyLimitAsFraction = true;

    public isUsingNoBaseCurrencyLimit = false;
    public isUsingBaseCurrencyLimitAsFraction = true;
    public isDemo = false;

    private noOrderLimit = -1;

    @ViewChild('confirmContent')
    confirmContentModal;

    @ViewChild('addStrategyExecutionForm')
    addStrategyExecutionForm;

    @ViewChild('buyLowerAndLowerSpecificParameters')
    buyLowerAndLowerSpecificParametersComponent: BuyLowerAndLowerSpecificParametersComponent;

    @ViewChild('sellHigherAndHigherSpecificParameters')
    sellHigherAndHigherSpecificParametersComponent: SellHigherAndHigherSpecificParametersComponent;

    @ViewChild('sellWhenOtherCurrencyGrowsSpecificParameters')
    sellWhenSecondCurrencyGrowsParametersComponent: SellWhenSecondCurrencyGrowsParametersComponent;

    @ViewChild('sellNowSpecificParameters')
    sellNowParametersComponent: SellNowParametersComponent;

    @ViewChild('buyNowSpecificParameters')
    buyNowParametersComponent: BuyNowParametersComponent;

    constructor(
        private route: ActivatedRoute,
        private exchangeUsersService: ExchangeUsersService,
        private modalService: NgbModal,
        private toastService: ToastService,
        private strategiesService: StrategiesService,
        private strategiesExecutionsService: StrategiesExecutionsService,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    ngOnInit() {
        this.creatingStrategiesInProgress = false;
        this.finishedCreatingStrategies = false;
        this.strategiesNotCreatedFor = [];
        this.strategiesCreatedFor = [];
        this.route.params.subscribe(params => {
            this.exchangeName = params.exchangeName;
        });

        this.loadExchangeUsers();
        this.loadStrategies();
    }

    private loadExchangeUsers() {
        this.exchangeUsersService.getExchangeUsers().subscribe(exchangeUsers => {
            for (const exchangeUser of exchangeUsers) {
                this.exchangeUserSelectionList.push({exchangeUser: exchangeUser, checked: false});
            }
            if (exchangeUsers.length === 1) {
                this.exchangeUserSelectionList[0].checked = true;
            }
        });
    }

    getSelectedExchangeUsers() {
        return this.exchangeUserSelectionList.filter(it => it.checked);
    }

    showConfirmModal() {
        this.modalService.open(this.confirmContentModal, {windowClass: 'confirm-order-modal'}).result.then(result => {
            this.createStrategy();
        }, () => {
        });
    }

    canMakeStrategyExecution() {
        return this.getSelectedExchangeUsers().length > 0
            && this.addStrategyExecutionForm.valid
            && this.validateStrategySpecificParameters()
            && this.featureToggle.isActive(FEATURE_CREATE_STRATEGY);
    }

    loadStrategies() {
        this.strategiesService.getStrategies().subscribe(strategies => {
            this.strategies = strategies;
        });
    }

    useCounterCurrencyLimitAsFraction() {
        this.isUsingCounterCurrencyLimitAsFraction = true;
        this.isUsingNoCounterCurrencyLimit = false;
    }

    useCounterCurrencyLimitAsAmount() {
        this.isUsingCounterCurrencyLimitAsFraction = false;
        this.isUsingNoCounterCurrencyLimit = false;
    }

    useBaseCurrencyLimitAsFraction() {
        this.isUsingBaseCurrencyLimitAsFraction = true;
        this.isUsingNoBaseCurrencyLimit = false;
    }

    useBaseCurrencyLimitAsAmount() {
        this.isUsingBaseCurrencyLimitAsFraction = false;
        this.isUsingNoBaseCurrencyLimit = false;
    }


    onSpecificParameters(parameters) {
        this.strategySpecificParameters = parameters;
    }

    private getStrategyBuyParameters(): StrategyBuyParametersDto | null {
        return (this.isBuying() ?
            <StrategyBuyParametersDto>{
                counterCurrencyPercentLimitForBuying:
                    (this.isUsingNoCounterCurrencyLimit ?
                        this.noOrderLimit :
                        (this.isUsingCounterCurrencyLimitAsFraction ?
                            this.counterCurrencyPercentLimitForBuying : this.noOrderLimit)),
                counterCurrencyAmountLimitForBuying: (this.isUsingNoCounterCurrencyLimit ?
                    this.noOrderLimit :
                    (this.isUsingCounterCurrencyLimitAsFraction ?
                        this.noOrderLimit : this.counterCurrencyAmountLimitForBuying)),
                counterCurrencyPercentForBuyingPerOrder: this.counterCurrencyPercentForBuyingPerOrder
            } : null);
    }

    private getStrategySellParameters(): StrategySellParametersDto | null {
        return (this.isSelling() ?
            <StrategySellParametersDto>{
                baseCurrencyPercentLimitForSelling: (this.isUsingNoBaseCurrencyLimit ?
                    this.noOrderLimit :
                    (this.isUsingBaseCurrencyLimitAsFraction ?
                        this.baseCurrencyPercentLimitForSelling : this.noOrderLimit)),
                baseCurrencyAmountLimitForSelling: (this.isUsingNoBaseCurrencyLimit ?
                    this.noOrderLimit :
                    (this.isUsingBaseCurrencyLimitAsFraction ?
                        this.noOrderLimit : this.baseCurrencyAmountLimitForSelling)),
                baseCurrencyPercentForSellingPerOrder: this.baseCurrencyPercentForSellingPerOrder
            } : null);
    }

    createStrategy() {
        this.creatingStrategiesInProgress = true;
        const selectedExchangeUsers = this.getSelectedExchangeUsers();
        let howManyStrategiesToCreateLeft = selectedExchangeUsers.length;
        for (const selectedExchangeUser of selectedExchangeUsers) {
            const exchangeUser = selectedExchangeUser.exchangeUser;
            const parameters: StrategyParametersRequestDto = {
                exchangeUserId: exchangeUser.id,
                exchangeName: this.exchangeName,
                strategyName: this.selectedStrategyName,
                baseCurrencyCode: this.baseCurrency(),
                counterCurrencyCode: this.counterCurrency(),
                sellParameters: this.getStrategySellParameters(),
                buyParameters: this.getStrategyBuyParameters(),
                strategySpecificParameters: this.strategySpecificParameters,
                isDemo: this.isDemo
            };

            this.strategiesExecutionsService.createStrategyExecution(parameters)
                .subscribe((response: WithMessageDto<StrategyExecutionResponseDto>) => {
                    howManyStrategiesToCreateLeft--;
                    this.strategiesCreatedFor.push(exchangeUser.name);
                    this.creatingStrategiesInProgress = howManyStrategiesToCreateLeft > 0;
                    this.finishedCreatingStrategies = howManyStrategiesToCreateLeft === 0;
                }, error => {
                    console.log(error);
                    howManyStrategiesToCreateLeft--;
                    this.strategiesNotCreatedFor.push(exchangeUser.name);
                    this.creatingStrategiesInProgress = howManyStrategiesToCreateLeft > 0;
                    this.finishedCreatingStrategies = howManyStrategiesToCreateLeft === 0;
                });
        }
    }

    public baseCurrency() {
        if (this.currencyPair !== undefined && this.currencyPair.indexOf('/') !== -1) {
            return this.currencyPair.split('/')[0].toUpperCase();
        } else {
            return '';
        }
    }

    public counterCurrency() {
        if (this.currencyPair !== undefined && this.currencyPair.indexOf('/') !== -1) {
            return this.currencyPair.split('/')[1].toUpperCase();
        } else {
            return '';
        }
    }

    public isBuying(): boolean {
        return this.strategies.find(strategy => strategy.name === this.selectedStrategyName).isBuying;
    }

    public isSelling(): boolean {
        return this.strategies.find(strategy => strategy.name === this.selectedStrategyName).isSelling;
    }

    private validateStrategySpecificParameters() {
        if (this.strategySpecificParameters.validate) {
            const validationResult: String[] = this.strategySpecificParameters.validate();
            if (validationResult.length > 0) {
                console.warn(`Cannot create strategy.  ${validationResult[0]}`);
                return false;
            }
        }
        return true;
    }
}
