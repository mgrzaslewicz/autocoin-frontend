import {Component, OnInit} from '@angular/core';
import {ExchangeUsersService} from '../../services/api';
import {Exchange, ExchangeKeyExistenceResponseDto, ExchangeUser} from '../../models';
import {ToastService} from '../../services/toast.service';
import {forkJoin} from 'rxjs';

export interface ExchangeNameWithExchangeUser {
    exchangeName: string;
    exchangeUser: ExchangeUser;
}

@Component({
    selector: 'app-exchange-users',
    templateUrl: './exchange-users.component.html',
    styleUrls: ['./exchange-users.component.scss']
})
export class ExchangeUsersComponent implements OnInit {
    public exchangeUsers: ExchangeUser[] = [];
    public exchanges: Exchange[];
    public exchangesKeyExistenceList: ExchangeKeyExistenceResponseDto[];
    public selectedExchangeNamesWithExchangeUsers: ExchangeNameWithExchangeUser[] = [];
    public isLoading = true;

    constructor(
        private exchangeUsersService: ExchangeUsersService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.selectedExchangeNamesWithExchangeUsers = [];

        forkJoin(
            this.exchangeUsersService.getExchangeUsers(),
            this.exchangeUsersService.getExchanges(),
            this.exchangeUsersService.getExchangesKeysExistence()
        ).subscribe(([exchangeUsers, exchanges, exchangesKeysExistence]) => {
            this.exchangeUsers = exchangeUsers;
            this.exchanges = exchanges;
            this.exchangesKeyExistenceList = exchangesKeysExistence;
            this.isLoading = false;
        }, error => {
            this.exchangeUsers = [];
            this.isLoading = false;
            this.toastService.danger('Sorry, something went wrong. Could not get exchangeUsers.');
        });
    }

    getExchangesNamesOfExchangeUser(exchangeUser: ExchangeUser) {
        const names = [];
        const exchangesKeys = this.exchangesKeyExistenceList.filter(exchangesKey => exchangesKey.exchangeUserId === exchangeUser.id);
        exchangesKeys.forEach(exchangesKey => {
            const exchange = this.exchanges.find(it => it.id === exchangesKey.exchangeId);
            names.push(exchange.name);
        });
        return names.sort((a, b) => a.localeCompare(b));
    }

    onSelectExchangeUserExchangeName(exchangeUser: ExchangeUser, exchangeName: string) {
        const index = this.findExchangeUserExchangeIndex(exchangeUser, exchangeName);

        if (index !== -1) {
            this.selectedExchangeNamesWithExchangeUsers.splice(index, 1);
        } else {
            this.selectedExchangeNamesWithExchangeUsers.push({exchangeUser: exchangeUser, exchangeName: exchangeName});
        }
    }

    isExchangeUserExchangeSelected(exchangeUser: ExchangeUser, exchangeName) {
        return this.findExchangeUserExchangeIndex(exchangeUser, exchangeName) !== -1;
    }

    findExchangeUserExchangeIndex(exchangeUser: ExchangeUser, exchangeName) {
        return this.selectedExchangeNamesWithExchangeUsers.findIndex(object => {
            return object.exchangeUser === exchangeUser && object.exchangeName === exchangeName;
        });
    }

}
