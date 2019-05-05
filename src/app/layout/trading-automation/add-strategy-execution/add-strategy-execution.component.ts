import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ExchangeUser} from '../../../models';
import {ExchangeUsersService} from '../../../services/api';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../services/toast.service';
import {Strategy, StrategyExecutionResponseDto, StrategyParametersRequest} from '../../../models/strategy';
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
    public counterCurrencyFractionForBuying = 0.2;
    public baseCurrencyFractionForSelling = 0.2;
    public maxCounterCurrencyPercentForBuying = 50;
    public maxBaseCurrencyPercentForSelling = 50;
    public strategySpecificParameters: any;
    public creatingStrategiesInProgress = false;
    public finishedCreatingStrategies = false;
    public strategiesNotCreatedFor: string[] = [];
    public strategiesCreatedFor: string[] = [];

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
            && this.featureToggle.isActive(FEATURE_CREATE_STRATEGY);
    }

    loadStrategies() {
        this.strategiesService.getStrategies().subscribe(strategies => {
            this.strategies = strategies;
        });
    }

    onCounterCurrencyPercentForBuying(control) {
        if (control.value) {
            control.value = Math.min(Math.max(control.value, 0.1), 100);
            this.counterCurrencyFractionForBuying = control.value / 100;
        }
    }

    onBaseCurrencyPercentForSelling(control) {
        if (control.value) {
            control.value = Math.min(Math.max(control.value, 0.1), 100);
            this.baseCurrencyFractionForSelling = control.value / 100;
        }
    }

    onMaxCounterCurrencyPercentForBuying(control) {
        if (control.value) {
            control.value = Math.min(Math.max(control.value, 0.1), 100);
            this.maxCounterCurrencyPercentForBuying = Number(control.value);
        }
    }

    onMaxBaseCurrencyPercentForSelling(control) {
        if (control.value) {
            control.value = Math.min(Math.max(control.value, 0.1), 100);
            this.maxBaseCurrencyPercentForSelling = Number(control.value);
        }
    }

    onSpecificParameters(parameters) {
        this.strategySpecificParameters = parameters;
    }

    createStrategy() {
        this.creatingStrategiesInProgress = true;
        const selectedExchangeUsers = this.getSelectedExchangeUsers();
        let howManyStrategiesToCreateLeft = selectedExchangeUsers.length;
        for (const selectedExchangeUser of selectedExchangeUsers) {
            const exchangeUser = selectedExchangeUser.exchangeUser;

            const parameters = new StrategyParametersRequest();
            parameters.exchangeUserId = exchangeUser.id;
            parameters.exchangeName = this.exchangeName;
            parameters.strategyName = this.selectedStrategyName;
            parameters.baseCurrencyCode = this.baseCurrency();
            parameters.counterCurrencyCode = this.counterCurrency();
            parameters.baseCurrencyFractionForSelling = this.baseCurrencyFractionForSelling;
            parameters.counterCurrencyFractionForBuying = this.counterCurrencyFractionForBuying;
            parameters.maxBaseCurrencyPercentForSelling = this.maxBaseCurrencyPercentForSelling;
            parameters.maxCounterCurrencyPercentForBuying = this.maxCounterCurrencyPercentForBuying;
            parameters.strategySpecificParameters = this.strategySpecificParameters;

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
}
