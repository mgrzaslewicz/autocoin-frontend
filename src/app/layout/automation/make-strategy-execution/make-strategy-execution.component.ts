import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {CurrencyPair, Client} from '../../../models';
import {WatchCurrencyPairsService} from '../../../services/watch-currency-pairs.service';
import {ClientsService} from '../../../services/api';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../services/toast.service';
import {StrategiesService} from '../../../services/automation/strategies.service';
import {Strategy, StrategyParametersRequest} from '../../../models/strategy';
import {BuyLowerAndLowerSpecificParametersComponent} from './buy-lower-and-lower-specific-parameters/buy-lower-and-lower-specific-parameters.component';
import {StrategiesExecutionsService} from '../../../services/automation/strategies-executions.service';
import {FEATURE_CREATE_STRATEGY, FeatureToggle, FeatureToggleToken} from '../../../services/feature.toogle.service';

@Component({
    selector: 'app-make-strategy-execution',
    templateUrl: './make-strategy-execution.component.html',
    styleUrls: ['./make-strategy-execution.component.scss']
})
export class MakeStrategyExecutionComponent implements OnInit {

    public exchangeName;
    public allExchangePairs: CurrencyPair[];
    public exchangePair: string;
    public selectedClients = [];
    public strategies: Strategy[];
    public selectedStrategy = 'BuyLowerAndLower';
    public exitCurrencyFractionForBuying = 0.2;
    public maxExitCurrencyPercentForBuying = 50;
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

    constructor(
        private route: ActivatedRoute,
        private clientsService: ClientsService,
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
        this.clientsService.getClients().subscribe(clients => {
            for (const client of clients) {
                this.selectedClients.push({client: client, checked: false});
            }
        });
    }

    filteredSelectedClients() {
        return this.selectedClients.filter(client => client.checked);
    }

    showConfirmModal() {
        this.modalService.open(this.confirmContentModal, {windowClass: 'confirm-order-modal'}).result.then(result => {
            this.createStrategy();
        }, () => {
        });
    }

    canMakeStrategyExecution() {
        return this.filteredSelectedClients().length > 0
            && this.makeOrderForm.valid
            && this.featureToggle.isActive(FEATURE_CREATE_STRATEGY);
    }

    loadStrategies() {
        this.strategiesService.getStrategies().subscribe(strategies => {
            this.strategies = strategies;
        });
    }

    onExitCurrencyPercentageForBuying(control) {
        if (control.value) {
            control.value = Math.min(Math.max(control.value, 0.1), 100);
            this.exitCurrencyFractionForBuying = control.value / 100;
        }
    }

    onMaxExitCurrencyPercentForBuying(control) {
        if (control.value) {
            control.value = Math.min(Math.max(control.value, 0.1), 100);
            this.maxExitCurrencyPercentForBuying = Number(control.value);
        }
    }

    onSpecificParameters(parameters) {
        this.strategySpecificParameters = parameters;
    }

    createStrategy() {
        this.creatingStrategiesInProgress = true;
        let howManyStrategiesToCreateLeft = this.selectedClients.length;
        for (const selectedClient of this.selectedClients) {
            const client = selectedClient.client;

            const parameters = new StrategyParametersRequest();
            parameters.clientId = client.id;
            parameters.exchangeName = this.exchangeName;
            parameters.strategyName = this.selectedStrategy;
            parameters.entryCurrencyCode = this.entryCurrency;
            parameters.exitCurrencyCode = this.exitCurrency;
            parameters.exitCurrencyFractionForBuying = this.exitCurrencyFractionForBuying;
            parameters.maxExitCurrencyPercentForBuying = this.maxExitCurrencyPercentForBuying;
            parameters.strategySpecificParameters = this.strategySpecificParameters;

            this.strategiesExecutionsService.createStrategyExecution(parameters).subscribe(() => {
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

    get entryCurrency() {
        return this.exchangePair.split('/')[0];
    }

    get exitCurrency() {
        return this.exchangePair.split('/')[1];
    }

}
