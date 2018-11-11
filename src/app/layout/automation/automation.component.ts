import {Component, OnInit} from '@angular/core';
import {StrategiesExecutionsService} from '../../services/automation/strategies-executions.service';
import {Observable} from 'rxjs';
import {ToastService} from '../../services/toast.service';
import {ExchangeUser, Exchange} from '../../models';
import {ExchangesService} from '../../services/automation/exchanges.service';
import {StrategyExecutionResponseDto} from '../../models/strategy';
import {ExchangeUsersService} from '../../services/api';

@Component({
    selector: 'app-automation',
    templateUrl: './automation.component.html',
    styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {

    exchanges: Exchange[] = [];
    clients: ExchangeUser[] = [];
    private strategiesExecutions: StrategyExecutionResponseDto[];
    public supportedExchanges = ['binance', 'bittrex', 'kucoin'];

    constructor(
        private toastService: ToastService,
        private exchangesService: ExchangesService,
        private strategiesExecutionsService: StrategiesExecutionsService,
        private clientsService: ExchangeUsersService
    ) {
    }

    ngOnInit() {
        this.loadData();
    }

    public isSupported(exchangeName: string): boolean {
        return this.supportedExchanges.find(it => it === exchangeName) != null;
    }

    loadData() {
        Observable.forkJoin(
            this.exchangesService.getExchanges(),
            this.strategiesExecutionsService.getStrategiesExecutions(),
            this.clientsService.getExchangeUsers()
        ).subscribe(([exchanges, strategiesExecutions, clients]) => {
            this.exchanges = exchanges;
            this.strategiesExecutions = strategiesExecutions;
            this.clients = clients;
            console.log(this.strategiesExecutions);
        }, error => {
            this.clients = [];
            this.exchanges = [];
            this.strategiesExecutions = [];
            this.toastService.danger('Sorry, something went wrong.');
        });
    }

    getStrategiesExecutionsByExchangeName(exchangeName): StrategyExecutionResponseDto[] {
        return this.strategiesExecutions.filter(strategyExecution => {
            return strategyExecution.exchangeName === exchangeName;
        });
    }

    getClientNameById(clientId: string): string {
        return this.clients.find(client => client.id === clientId).name;
    }

    deleteStrategyExecution(strategyExecution) {
        this.strategiesExecutionsService.deleteStrategyExecution(strategyExecution.id).subscribe(() => {
            this.loadData();
        });
    }
}
