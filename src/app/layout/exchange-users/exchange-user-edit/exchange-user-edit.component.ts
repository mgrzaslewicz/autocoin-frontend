import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExchangeUsersService} from '../../../services/api';
import {ExchangeUser, Exchange, ExchangeKey, UpdateExchangeKeyRequestDto} from '../../../models';
import {ToastService} from '../../../services/toast.service';
import * as _ from 'underscore';
import {FEATURE_USE_SPRING_AUTH_SERVICE, FeatureToggle, FeatureToggleToken} from '../../../services/feature.toogle.service';
import {forkJoin} from 'rxjs';

interface ExchangeFields {
    apiKey?: string;
    secretKey?: string;
    userName?: string;
}

interface ExchangeUserNameWithExchangeKeys {
    name: string;
    exchangesKeys: Map<string, ExchangeFields>;
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

    public exchangesKeys: ExchangeKey[];

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
            this.exchangeUsersService.getExchangeKeysForExchangeUser(this.route.snapshot.params.exchangeUserId)
        ).subscribe(([exchanges, exchangeUser, exchangesKeys]) => {
            this.exchanges = this.sortAZ(exchanges);
            this.exchangeUser = exchangeUser;
            this.exchangesKeys = exchangesKeys;
        });
    }

    private sortAZ(exchanges: Exchange[]): Exchange[] {
        return exchanges.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    isShowingDeleteKeyButton(): boolean {
        return this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE);
    }

    isExchangeKeyFilled(exchange: Exchange) {
        return _(this.exchangesKeys).find({exchangeId: exchange.id});
    }

    onSubmit(createForm) {
        this.loading = true;
        console.log('Updating exchange keys where filled');
        const subscriptions = [this.updateExchangeUser()];

        console.log(createForm.value);
        const exchangeUserNameWithExchangeKeys: ExchangeUserNameWithExchangeKeys = createForm.value;
        const exchangeFieldsMap: Map<string, ExchangeFields> = exchangeUserNameWithExchangeKeys.exchangesKeys;
        console.log(exchangeFieldsMap);
        for (const exchangeId in exchangeFieldsMap) {
            console.log(exchangeId);
            const exchangeFields: ExchangeFields = exchangeFieldsMap[exchangeId];
            const requestData = this.getRequestData(exchangeId, exchangeFields);
            if (requestData != null) {
                const subscription = this.exchangeUsersService.updateExchangesKey(this.exchangeUser.id, exchangeId, requestData);
                subscriptions.push(subscription);
            }
        }

        forkJoin(subscriptions).subscribe(() => {
            this.toastService.success('Exchange user has been updated.');
            this.router.navigate(['/exchange-users']);
        }, error => {
            this.toastService.danger(error.message);
            this.loading = false;
        });
    }

    private getRequestDataDeprecated(exchangeId: string, formKeys): any {
        const areKeysFilled = formKeys.apiKey && formKeys.secretKey;
        let formData = null;
        if (areKeysFilled) {
            if (this.exchangeIdToExchangeName(exchangeId) === 'bitstamp' && formKeys.userName) {
                formData = {
                    apiKey: formKeys.userName + '$$$' + formKeys.apiKey,
                    secretKey: formKeys.secretKey
                };
            } else {
                formData = {
                    apiKey: formKeys.apiKey,
                    secretKey: formKeys.secretKey
                };
            }
        }
        return formData;
    }

    private getRequestData(exchangeId: string, exchangeFields: ExchangeFields): any {
        if (this.featureToggle.isActive(FEATURE_USE_SPRING_AUTH_SERVICE)) {
            const exchangeName = this.exchangeIdToExchangeName(exchangeId);
            const isBitstamp = exchangeName === 'bitstamp';
            let areKeysFilled = exchangeFields.apiKey && exchangeFields.secretKey;
            if (isBitstamp) {
                areKeysFilled = areKeysFilled && exchangeFields.userName;
            }
            let formData: UpdateExchangeKeyRequestDto = null;
            if (areKeysFilled) {
                formData = {
                    userName: exchangeFields.userName,
                    apiKey: exchangeFields.apiKey,
                    secretKey: exchangeFields.secretKey
                };
            }
            console.log(`Going to update exchange keys for exchange ${exchangeName}: ${areKeysFilled}`);
            return formData;
        } else {
            return this.getRequestDataDeprecated(exchangeId, exchangeFields);
        }
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
                this.exchangeUsersService.getExchangeKeysForExchangeUser(this.route.snapshot.params.exchangeUserId)
                    .subscribe(it => this.exchangesKeys = it);
            });
    }

}
