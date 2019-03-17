import {Component, OnInit} from '@angular/core';
import {StrategiesExecutionsService} from '../../services/automation/strategies-executions.service';
import {forkJoin, Observable} from 'rxjs';
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
    exchangeUsers: ExchangeUser[] = [];
    private strategiesExecutions: StrategyExecutionResponseDto[];
    public supportedExchanges = ['binance', 'bittrex', 'kucoin'];

    constructor(
        private toastService: ToastService,
        private exchangesService: ExchangesService,
        private strategiesExecutionsService: StrategiesExecutionsService,
        private exchangeUsersService: ExchangeUsersService
    ) {
    }

    ngOnInit() {
        this.loadData();
    }

    public isSupported(exchangeName: string): boolean {
        return this.supportedExchanges.find(it => it === exchangeName) != null;
    }

    loadData() {
        forkJoin(
            this.exchangesService.getExchanges(),
            this.strategiesExecutionsService.getStrategiesExecutions(),
            this.exchangeUsersService.getExchangeUsers()
        ).subscribe(([exchanges, strategiesExecutions, exchangeUsers]) => {
            this.exchanges = exchanges;
            this.strategiesExecutions = strategiesExecutions;
            this.exchangeUsers = exchangeUsers;
            console.log('Strategy executions:');
            console.log(this.strategiesExecutions);
        }, error => {
            this.exchangeUsers = [];
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

    getExchangeUserNameById(exchangeUserId: string): string {
        return this.exchangeUsers.find(exchangeUser => exchangeUser.id === exchangeUserId).name;
    }

    deleteStrategyExecution(strategyExecution) {
        this.strategiesExecutionsService.deleteStrategyExecution(strategyExecution.id).subscribe(() => {
            this.loadData();
        });
    }
}
