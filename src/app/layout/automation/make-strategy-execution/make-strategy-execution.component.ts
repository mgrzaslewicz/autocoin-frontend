import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {CurrencyPair} from '../../../models';
import {WatchCurrencyPairsService} from '../../../services/watch-currency-pairs.service';
import {ExchangeUsersService} from '../../../services/api';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../services/toast.service';
import {StrategiesService} from '../../../services/automation/strategies.service';
import {Strategy, StrategyExecutionResponseDto, StrategyParametersRequest} from '../../../models/strategy';
import {BuyLowerAndLowerSpecificParametersComponent} from './buy-lower-and-lower-specific-parameters/buy-lower-and-lower-specific-parameters.component';
import {StrategiesExecutionsService} from '../../../services/automation/strategies-executions.service';
import {FEATURE_CREATE_STRATEGY, FeatureToggle, FeatureToggleToken} from '../../../services/feature.toogle.service';
import {SellHigherAndHigherSpecificParametersComponent} from './sell-higher-and-higher-specific-parameters/sell-higher-and-higher-specific-parameters.component';
import {SellWhenSecondCurrencyGrowsParametersComponent} from './sell-when-second-currency-grows-parameters/sell-when-second-currency-grows-parameters.component';
import {WithMessageDto} from '../../../services/api/api.service';
import {SellNowParametersComponent} from './sell-now-parameters/sell-now-parameters.component';
import {BuyNowParametersComponent} from './buy-now-parameters/buy-now-parameters.component';

@Component({
    selector: 'app-make-strategy-execution',
    templateUrl: './make-strategy-execution.component.html',
    styleUrls: ['./make-strategy-execution.component.scss']
})
export class MakeStrategyExecutionComponent implements OnInit {

    public exchangeName;
    public allExchangePairs: CurrencyPair[];
    public exchangePair: string;
    public clients = [];
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

    @ViewChild('makeOrderForm')
    makeOrderForm;

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
        private clientsService: ExchangeUsersService,
        private watchedCurrencyPairs: WatchCurrencyPairsService,
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

        this.allExchangePairs = this.watchedCurrencyPairs.all();

        this.loadClients();
        this.loadStrategies();
    }

    searchExchangePair = (text$: Observable<string>) => {
        return text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(exchangePairSymbol => exchangePairSymbol.toUpperCase())
            .map(exchangePairSymbol => {
                return this.allExchangePairs.filter(pair => pair.symbol().indexOf(exchangePairSymbol) > -1).slice(0, 10);
            })
            .map(pairs => pairs.map(pair => pair.symbol()));
    };

    private loadClients() {
        this.clientsService.getExchangeUsers().subscribe(clients => {
            for (const client of clients) {
                this.clients.push({client: client, checked: false});
            }
            if (clients.length === 1) {
                this.clients[0].checked = true;
            }
        });
    }

    getSelectedClients() {
        return this.clients.filter(client => client.checked);
    }

    showConfirmModal() {
        this.modalService.open(this.confirmContentModal, {windowClass: 'confirm-order-modal'}).result.then(result => {
            this.createStrategy();
        }, () => {
        });
    }

    canMakeStrategyExecution() {
        return this.getSelectedClients().length > 0
            && this.makeOrderForm.valid
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
        const selectedClients = this.getSelectedClients();
        let howManyStrategiesToCreateLeft = selectedClients.length;
        for (const selectedClient of selectedClients) {
            const client = selectedClient.client;

            const parameters = new StrategyParametersRequest();
            parameters.clientId = client.id;
            parameters.exchangeName = this.exchangeName;
            parameters.strategyName = this.selectedStrategyName;
            parameters.baseCurrencyCode = this.baseCurrency;
            parameters.counterCurrencyCode = this.counterCurrency;
            parameters.baseCurrencyFractionForSelling = this.baseCurrencyFractionForSelling;
            parameters.counterCurrencyFractionForBuying = this.counterCurrencyFractionForBuying;
            parameters.maxBaseCurrencyPercentForSelling = this.maxBaseCurrencyPercentForSelling;
            parameters.maxCounterCurrencyPercentForBuying = this.maxCounterCurrencyPercentForBuying;
            parameters.strategySpecificParameters = this.strategySpecificParameters;

            this.strategiesExecutionsService.createStrategyExecution(parameters)
                .subscribe((response: WithMessageDto<StrategyExecutionResponseDto>) => {
                    howManyStrategiesToCreateLeft--;
                    this.strategiesCreatedFor.push(client.name);
                    this.creatingStrategiesInProgress = howManyStrategiesToCreateLeft > 0;
                    this.finishedCreatingStrategies = howManyStrategiesToCreateLeft === 0;
                }, error => {
                    console.log(error);
                    howManyStrategiesToCreateLeft--;
                    this.strategiesNotCreatedFor.push(client.name);
                    this.creatingStrategiesInProgress = howManyStrategiesToCreateLeft > 0;
                    this.finishedCreatingStrategies = howManyStrategiesToCreateLeft === 0;
                });
        }
    }

    get baseCurrency() {
        return this.exchangePair.split('/')[0];
    }

    get counterCurrency() {
        return this.exchangePair.split('/')[1];
    }

    public isBuying(): boolean {
        return this.strategies.find(strategy => strategy.name === this.selectedStrategyName).isBuying;
    }

    public isSelling(): boolean {
        return this.strategies.find(strategy => strategy.name === this.selectedStrategyName).isSelling;
    }
}
