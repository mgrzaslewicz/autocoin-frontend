import {Component, OnInit} from '@angular/core';
import {ExchangeUsersService} from '../../services/api';
import {Exchange, ExchangeKeyCapabilityResponseDto, ExchangeKeyExistenceResponseDto, ExchangeUser} from '../../models';
import {ToastService} from '../../services/toast.service';
import {forkJoin} from 'rxjs';
import {ExchangeKeyCapabilityService} from '../../services/exchange-key-capability.service';

@Component({
    selector: 'app-exchange-users',
    templateUrl: './exchange-users.component.html',
    styleUrls: ['./exchange-users.component.scss']
})
export class ExchangeUsersComponent implements OnInit {
    public isLoading = true;
    public exchangeUsers: ExchangeUser[] = [];
    public exchanges: Exchange[];
    public exchangesKeyExistenceList: ExchangeKeyExistenceResponseDto[];
    private exchangeUserToExchangesKeyCapabilityList: Map<string, ExchangeKeyCapabilityResponseDto[]> = new Map();
    private exchangeUserIdToIsFetchingKeysCapabilityInProgress: Map<string, boolean> = new Map();

    constructor(
        private exchangeUsersService: ExchangeUsersService,
        private exchangeKeyCapabilityService: ExchangeKeyCapabilityService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
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
            this.exchangeUserToExchangesKeyCapabilityList.clear();
            this.exchangeUserIdToIsFetchingKeysCapabilityInProgress.clear();
            this.toastService.danger('Sorry, something went wrong. Could not get exchangeUsers.');
        });
    }

    getExchangesOfExchangeUser(exchangeUser: ExchangeUser): Exchange[] {
        const exchanges = [];
        const exchangesKeys = this.exchangesKeyExistenceList.filter(exchangesKey => exchangesKey.exchangeUserId === exchangeUser.id);
        exchangesKeys.forEach(exchangesKey => {
            const exchange = this.exchanges.find(it => it.id === exchangesKey.exchangeId);
            exchanges.push(exchange);
        });
        return exchanges.sort((a, b) => a.name.localeCompare(b.name));
    }

    isFetchingKeysCapability(exchangeUser: ExchangeUser): boolean {
        const key = exchangeUser.id;
        const result = this.exchangeUserIdToIsFetchingKeysCapabilityInProgress.has(key)
            && this.exchangeUserIdToIsFetchingKeysCapabilityInProgress.get(key);
        return result;
    }

    fetchExchangeUserKeysCapability(exchangeUser: ExchangeUser) {
        this.exchangeUserIdToIsFetchingKeysCapabilityInProgress.set(exchangeUser.id, true);
        this.exchangeUserToExchangesKeyCapabilityList.clear();
        this.exchangeKeyCapabilityService.getExchangeKeysValidity(exchangeUser.id).subscribe(exchangeKeysValidity => {
            this.exchangeUserToExchangesKeyCapabilityList.set(exchangeUser.id, exchangeKeysValidity);
            this.exchangeUserIdToIsFetchingKeysCapabilityInProgress.set(exchangeUser.id, false);
        }, error => {
            this.toastService.warning('Something went wrong, could not check API keys');
            this.exchangeUserIdToIsFetchingKeysCapabilityInProgress.set(exchangeUser.id, false);
        });
    }

    isApiKeyNotWorking(exchangeUser: ExchangeUser, exchange: Exchange): boolean {
        const exchangeUserKeyCapabilityList = this.exchangeUserToExchangesKeyCapabilityList.get(exchangeUser.id);
        if (exchangeUserKeyCapabilityList !== undefined) {
            const exchangeKeyCapability = exchangeUserKeyCapabilityList.find(it =>
                it.exchangeUserId === exchangeUser.id
                && it.exchangeId === exchange.id
            );
            if (exchangeKeyCapability !== undefined) {
                return !exchangeKeyCapability.canReadWallet;
            }
        }
        return false;
    }

    isApiKeyWorking(exchangeUser: ExchangeUser, exchange: Exchange): boolean {
        const exchangeUserKeyValidityList = this.exchangeUserToExchangesKeyCapabilityList.get(exchangeUser.id);
        if (exchangeUserKeyValidityList !== undefined) {
            const exchangeKeyValidity = exchangeUserKeyValidityList.find(it =>
                it.exchangeUserId === exchangeUser.id
                && it.exchangeId === exchange.id
            );
            if (exchangeKeyValidity !== undefined) {
                return exchangeKeyValidity.canReadWallet;
            }
        }
        return false;
    }

}
