import {Component, OnInit} from '@angular/core';
import {StrategiesExecutionsService} from '../../services/trading-automation/strategies-executions.service';
import {forkJoin} from 'rxjs';
import {ToastService} from '../../services/toast.service';
import {Exchange, ExchangeUser} from '../../models';
import {StrategyExecutionResponseDto, StrategyExecutionStatus, StrategyParametersResponseDto} from '../../models/strategy';
import {ExchangeUsersService} from '../../services/api';
import {ExchangesService} from '../../services/trading-automation/exchanges.service';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-trading-strategies',
    templateUrl: './trading-strategies.component.html',
    styleUrls: ['./trading-strategies.component.scss']
})
export class TradingStrategiesComponent implements OnInit {

    exchanges: Exchange[] = [];
    exchangeUsers: ExchangeUser[] = [];
    isShowingOnlyActiveStrategies = true;
    private strategiesExecutions: StrategyExecutionResponseDto[];
    public exchangeNamesSupportedForTrading = ['binance', 'bittrex', 'kucoin'];

    constructor(
        private toastService: ToastService,
        private exchangesService: ExchangesService,
        private strategiesExecutionsService: StrategiesExecutionsService,
        private exchangeUsersService: ExchangeUsersService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon().subscribe(() => {
            this.loadData();
        });
    }

    public isSupportedForTrading(exchangeName: string): boolean {
        return this.exchangeNamesSupportedForTrading.find(it => it === exchangeName) != null;
    }

    getExchangesSupportedForTrading(): Exchange[] {
        return this.exchanges.filter(it => this.isSupportedForTrading(it.name));
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
        const result = this.strategiesExecutions
            .filter(strategyExecution => {
                return strategyExecution.exchangeName === exchangeName;
            });
        result.forEach(it => {
            if (!it.status) {
                it.status = StrategyExecutionStatus.Active;
            }
        });
        return result
            .filter(strategyExecution => {
                if (this.isShowingOnlyActiveStrategies) {
                    return strategyExecution.status === StrategyExecutionStatus.Active;
                } else {
                    return true;
                }
            });
        ;
    }

    flattenParameters(strategyParameters: StrategyParametersResponseDto) {
        const result = {
            ...strategyParameters,
            ...strategyParameters.strategySpecificParameters
        };
        delete result.strategySpecificParameters;
        return result;
    }

    getExchangeUserNameById(exchangeUserId: string): string {
        return this.exchangeUsers.find(exchangeUser => exchangeUser.id === exchangeUserId).name;
    }

    deleteStrategyExecution(strategyExecution) {
        this.strategiesExecutionsService.deleteStrategyExecution(strategyExecution.id).subscribe(() => {
            this.loadData();
        });
    }

    showAllStrategies() {
        this.isShowingOnlyActiveStrategies = false;
    }

    showOnlyActiveStrategies() {
        this.isShowingOnlyActiveStrategies = true;
    }

}
