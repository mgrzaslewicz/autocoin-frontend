import {Inject, Injectable} from '@angular/core';
import {Strategy} from '../../models/strategy';
import {Observable} from 'rxjs';
import {
    FEATURE_STRATEGY_BUY_NOW,
    FEATURE_STRATEGY_SELL_NOW,
    FEATURE_STRATEGY_SELL_WHEN_SECOND_CURRENCY_GROWS,
    FeatureToggle,
    FeatureToggleToken
} from '../feature.toogle.service';

@Injectable()
export class StrategiesService {

    constructor(@Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
    }

    getStrategies(): Observable<Strategy[]> {
        const strategies = [];

        const buyLowerAndLowerStrategy: Strategy = {
            name: 'BuyLowerAndLower',
            isBuying: true,
            isSelling: false
        };

        strategies.push(buyLowerAndLowerStrategy);

        const sellHigherAndHigherStrategy: Strategy = {
            name: 'SellHigherAndHigher',
            isBuying: false,
            isSelling: true
        };
        strategies.push(sellHigherAndHigherStrategy);

        if (this.featureToggle.isActive(FEATURE_STRATEGY_SELL_WHEN_SECOND_CURRENCY_GROWS)) {
            const sellWhenSecondCurrencyGrowsStrategy: Strategy = {
                name: 'SellWhenSecondCurrencyGrows',
                isBuying: false,
                isSelling: true
            };
            strategies.push(sellWhenSecondCurrencyGrowsStrategy);
        }

        if (this.featureToggle.isActive(FEATURE_STRATEGY_SELL_NOW)) {
            const sellNowStrategy: Strategy = {
                name: 'SellNow',
                isBuying: false,
                isSelling: true
            };
            strategies.push(sellNowStrategy);
        }

        if (this.featureToggle.isActive(FEATURE_STRATEGY_BUY_NOW)) {
            const buyNowStrategy: Strategy = {
                name: 'BuyNow',
                isBuying: true,
                isSelling: false
            };
            strategies.push(buyNowStrategy);
        }

        return Observable.of(strategies);
    }

}
