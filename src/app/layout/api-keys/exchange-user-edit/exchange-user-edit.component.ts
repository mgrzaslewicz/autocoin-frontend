import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExchangeUsersService} from '../../../services/api';
import {ExchangeUser, Exchange, UpdateExchangeKeyRequestDto, ExchangeKeyExistenceResponseDto} from '../../../models';
import {ToastService} from '../../../services/toast.service';
import * as _ from 'underscore';
import {FeatureToggle, FeatureToggleToken} from '../../../services/feature.toogle.service';
import {forkJoin} from 'rxjs';

interface ExchangeKeyFields {
    apiKey?: string;
    secretKey?: string;
    userName?: string;
    exchangeSpecificKeyParameters?: any;
}

interface ExchangeUserNameWithExchangeKeys {
    name: string;
    exchangesKeys: Map<string, ExchangeKeyFields>;
}

interface ExchangeSpecificKeyParameterConfiguration {
    name: string;
    displayLabel: string;
}

@Component({
    selector: 'app-exchange-user-edit',
    templateUrl: './exchange-user-edit.component.html',
    styleUrls: ['./exchange-user-edit.component.scss']
})
export class ExchangeUserEditComponent implements OnInit {

    public loading = false;

    public exchangeUser: ExchangeUser;

    public exchanges: Exchange[];

    public exchangesKeyExistenceList: ExchangeKeyExistenceResponseDto[];

    public exchangeSpecificKeyParametersConfiguration: Map<string, Array<ExchangeSpecificKeyParameterConfiguration>> = new Map([
        ['kucoin', [{name: 'passphrase', displayLabel: 'Passphrase'}]]
    ]);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private toastService: ToastService,
        private exchangeUsersService: ExchangeUsersService,
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle
    ) {
    }

    ngOnInit() {
        forkJoin(
            this.exchangeUsersService.getExchanges(),
            this.exchangeUsersService.findExchangeUser(this.route.snapshot.params.exchangeUserId),
            this.exchangeUsersService.getExchangeKeysExistenceForExchangeUser(this.route.snapshot.params.exchangeUserId)
        ).subscribe(([exchanges, exchangeUser, exchangesKeys]) => {
            this.exchanges = this.sortAZ(exchanges);
            this.exchangeUser = exchangeUser;
            this.exchangesKeyExistenceList = exchangesKeys;
        });
    }

    private sortAZ(exchanges: Exchange[]): Exchange[] {
        return exchanges.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    isExchangeKeyFilled(exchange: Exchange) {
        return _(this.exchangesKeyExistenceList).find({exchangeId: exchange.id});
    }

    onSubmit(createForm) {
        this.loading = true;
        console.log('Updating exchange keys where filled');
        const subscriptions = [this.updateExchangeUser()];

        console.log(createForm.value);
        const exchangeUserNameWithExchangeKeys: ExchangeUserNameWithExchangeKeys = createForm.value;
        const exchangeFieldsMap: Map<string, ExchangeKeyFields> = exchangeUserNameWithExchangeKeys.exchangesKeys;
        console.log(exchangeFieldsMap);
        for (const exchangeId in exchangeFieldsMap) {
            console.log(exchangeId);
            const exchangeFields: ExchangeKeyFields = exchangeFieldsMap[exchangeId];
            const requestData = this.getRequestData(exchangeId, exchangeFields);
            if (requestData != null) {
                console.log(requestData);
                const subscription = this.exchangeUsersService.updateExchangeKeys(this.exchangeUser.id, exchangeId, requestData);
                subscriptions.push(subscription);
            }
        }

        forkJoin(subscriptions).subscribe(() => {
            this.toastService.success('Exchange user has been updated.');
            this.router.navigate(['/api-keys']);
        }, error => {
            this.toastService.danger(error.message);
            this.loading = false;
        });
    }

    private getExchangeSpecificKeyParameters(exchangeName: string, exchangeKeyFields: any): any {
        const exchangeSpecificKeyParameters: Array<ExchangeSpecificKeyParameterConfiguration> = this.exchangeSpecificKeyParametersConfiguration.get(exchangeName);
        if (exchangeSpecificKeyParameters !== undefined && exchangeSpecificKeyParameters != null) {
            const result = {};
            for (const parameter of exchangeSpecificKeyParameters) {
                result[parameter.name] = exchangeKeyFields['exchangeSpecific' + parameter.name];
            }
            return result;
        } else {
            return null;
        }
    }

    private getRequestData(exchangeId: string, exchangeKeyFields: ExchangeKeyFields): any {
        const exchangeName = this.exchangeIdToExchangeName(exchangeId);
        const isBitstamp = exchangeName === 'bitstamp';
        let areKeysFilled = exchangeKeyFields.apiKey && exchangeKeyFields.secretKey;
        if (isBitstamp) {
            areKeysFilled = areKeysFilled && exchangeKeyFields.userName;
        }
        let formData: UpdateExchangeKeyRequestDto = null;

        if (areKeysFilled) {
            formData = {
                userName: exchangeKeyFields.userName,
                apiKey: exchangeKeyFields.apiKey,
                secretKey: exchangeKeyFields.secretKey,
                exchangeSpecificKeyParameters: this.getExchangeSpecificKeyParameters(exchangeName, exchangeKeyFields)
            };
        }
        console.log(`Going to update exchange keys for exchange ${exchangeName}: ${areKeysFilled}`);
        return formData;
    }

    private exchangeIdToExchangeName(exchangeId: string): string {
        return this.exchanges.find(exchange => exchange.id === exchangeId).name;
    }

    private updateExchangeUser() {
        return this.exchangeUsersService.updateExchangeUser(this.exchangeUser.id, {name: this.exchangeUser.name});
    }

    deleteExchangeKey(exchangeId: string) {
        console.log(`Deleting exchange key for exchange ${exchangeId} and user ${this.exchangeUser.id}`);
        this.exchangeUsersService.deleteExchangeKeys(this.exchangeUser.id, exchangeId)
            .subscribe(() => {
                this.exchangeUsersService.getExchangeKeysExistenceForExchangeUser(this.route.snapshot.params.exchangeUserId)
                    .subscribe(it => this.exchangesKeyExistenceList = it);
            });
    }

}
