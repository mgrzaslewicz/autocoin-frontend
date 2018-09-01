import {Inject, Injectable} from '@angular/core';
import {Strategy} from '../../models/strategy';
import {Observable} from 'rxjs';
import {FEATURE_STRATEGY_SELL_WHEN_SECOND_CURRENCY_GROWS, FeatureToggle, FeatureToggleToken} from '../feature.toogle.service';

@Injectable()
export class StrategiesService {

    constructor(@Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
    }

    getStrategies(): Observable<Strategy[]> {
        const strategies = [];

        const buyLowerAndLowerStrategy = new Strategy;
        buyLowerAndLowerStrategy.name = 'BuyLowerAndLower';
        strategies.push(buyLowerAndLowerStrategy);

        const sellHigherAndHigherStrategy = new Strategy;
        sellHigherAndHigherStrategy.name = 'SellHigherAndHigher';
        strategies.push(sellHigherAndHigherStrategy);

        if (this.featureToggle.isActive(FEATURE_STRATEGY_SELL_WHEN_SECOND_CURRENCY_GROWS)) {
            const sellWhenSecondCurrencyGrowsStrategy = new Strategy;
            sellWhenSecondCurrencyGrowsStrategy.name = 'SellWhenSecondCurrencyGrows';
            strategies.push(sellWhenSecondCurrencyGrowsStrategy);
        }

        return Observable.of(strategies);
    }

}
