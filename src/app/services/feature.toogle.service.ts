import {Injectable, InjectionToken} from '@angular/core';

export interface FeatureToggle {
    isActive(toggleName: string): boolean;
}

export const FEATURE_CREATE_STRATEGY = 'createStrategy';
export const FEATURE_STRATEGY_SELL_WHEN_SECOND_CURRENCY_GROWS = 'strategySellWhenSecondCurrencyGrows';
export const FEATURE_STRATEGY_SELL_NOW = 'strategySellNow';
export const FEATURE_STRATEGY_BUY_NOW = 'strategyBuyNow';

export const FeatureToggleToken = new InjectionToken('FeatureToggle');

@Injectable()
export class LocalStorageFeatureToggle implements FeatureToggle {

    isActive(toggleName: string): boolean {
        const localStorageToggle = localStorage.getItem(`toggle.${toggleName}`);
        if (localStorageToggle != null) {
            return localStorageToggle === 'true';
        } else {
            return this.isActiveByDefault(toggleName);
        }
    }

    private isActiveByDefault(toggleName: string) {
        return [
            FEATURE_CREATE_STRATEGY,
            FEATURE_STRATEGY_SELL_WHEN_SECOND_CURRENCY_GROWS,
            FEATURE_STRATEGY_SELL_NOW,
            FEATURE_STRATEGY_BUY_NOW
        ].includes(toggleName);
    }

}
