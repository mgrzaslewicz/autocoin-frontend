import {Component, OnInit} from '@angular/core';
import {StrategiesExecutionsService} from '../../services/trading-automation/strategies-executions.service';
import {forkJoin} from 'rxjs';
import {ToastService} from '../../services/toast.service';
import {Exchange, ExchangeUser} from '../../models';
import {LocalOrderDto, StrategyExecutionResponseDto, StrategyExecutionStatus, StrategyParametersResponseDto} from '../../models/strategy';
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
    isPendingRefresh = true;
    private strategiesExecutions: StrategyExecutionResponseDto[];
    private lastStrategiesRefreshTimeKey = 'lastStrategiesRefreshTime';
    public exchangeNamesSupportedForTrading = ['binance', 'bittrex', 'kucoin'];
    public noOrderLimit = -1;

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
        this.isPendingRefresh = true;
        forkJoin(
            this.exchangesService.getExchanges(),
            this.strategiesExecutionsService.getStrategiesExecutions(),
            this.exchangeUsersService.getExchangeUsers()
        ).subscribe(([exchanges, strategiesExecutions, exchangeUsers]) => {
            this.exchanges = exchanges;
            this.setStrategiesExecutions(strategiesExecutions);
            this.exchangeUsers = exchangeUsers;
            this.isPendingRefresh = false;
            console.log('Strategy executions:');
            console.log(this.strategiesExecutions);
        }, error => {
            this.exchangeUsers = [];
            this.exchanges = [];
            this.strategiesExecutions = [];
            this.toastService.danger('Sorry, something went wrong.');
        });
    }


    getLastStrategiesRefreshTime(): Date {
        return this.getLocalStorageKeyAsDate(this.lastStrategiesRefreshTimeKey);
    }

    private getLocalStorageKeyAsDate(key: string): Date {
        const timeString = localStorage.getItem(key);
        if (timeString != null) {
            const timeMs = Number(timeString);
            const date: Date = new Date();
            date.setTime(timeMs);
            return date;
        } else {
            return null;
        }
    }

    refreshStrategies() {
        this.isPendingRefresh = true;
        this.strategiesExecutionsService.getStrategiesExecutions().subscribe(
            (strategiesExecutions: StrategyExecutionResponseDto[]) => {
                this.setStrategiesExecutions(strategiesExecutions);
                this.isPendingRefresh = false;
            },
            () => {
                this.toastService.danger('Sorry, something went wrong.');
                this.isPendingRefresh = false;
            }
        );
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
    }

    flattenStrategyParameters(strategyParameters: StrategyParametersResponseDto) {
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

    private setStrategiesExecutions(strategiesExecutions: StrategyExecutionResponseDto[]) {
        localStorage.setItem(this.lastStrategiesRefreshTimeKey, new Date().getTime().toString());
        this.strategiesExecutions = strategiesExecutions;
    }

    sortedByCloseOrOpenTime(orders: LocalOrderDto[]) {
        return orders.sort((a, b) => {
            if (b.closeTime !== null && a.closeTime !== null) {
                return b.closeTime - a.closeTime;
            } else {
                return b.openTime - a.openTime;
            }
        });
    }
}
