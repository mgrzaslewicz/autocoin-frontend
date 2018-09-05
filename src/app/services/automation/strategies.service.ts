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

        const buyLowerAndLowerStrategy = new Strategy;
        buyLowerAndLowerStrategy.name = 'BuyLowerAndLower';
        buyLowerAndLowerStrategy.isBuying = true;
        buyLowerAndLowerStrategy.isSelling = false;
        strategies.push(buyLowerAndLowerStrategy);

        const sellHigherAndHigherStrategy = new Strategy;
        sellHigherAndHigherStrategy.name = 'SellHigherAndHigher';
        sellHigherAndHigherStrategy.isBuying = false;
        sellHigherAndHigherStrategy.isSelling = true;
        strategies.push(sellHigherAndHigherStrategy);

        if (this.featureToggle.isActive(FEATURE_STRATEGY_SELL_WHEN_SECOND_CURRENCY_GROWS)) {
            const sellWhenSecondCurrencyGrowsStrategy = new Strategy;
            sellWhenSecondCurrencyGrowsStrategy.name = 'SellWhenSecondCurrencyGrows';
            sellWhenSecondCurrencyGrowsStrategy.isBuying = false;
            sellWhenSecondCurrencyGrowsStrategy.isSelling = true;
            strategies.push(sellWhenSecondCurrencyGrowsStrategy);
        }

        if (this.featureToggle.isActive(FEATURE_STRATEGY_SELL_NOW)) {
            const sellNowStrategy = new Strategy;
            sellNowStrategy.name = 'SellNow';
            sellNowStrategy.isBuying = false;
            sellNowStrategy.isSelling = true;
            strategies.push(sellNowStrategy);
        }

        if (this.featureToggle.isActive(FEATURE_STRATEGY_BUY_NOW)) {
            const buyNowStrategy = new Strategy;
            buyNowStrategy.name = 'BuyNow';
            buyNowStrategy.isBuying = true;
            buyNowStrategy.isSelling = false;
            strategies.push(buyNowStrategy);
        }

        return Observable.of(strategies);
    }

}
