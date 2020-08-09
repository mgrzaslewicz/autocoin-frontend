import {Injectable, InjectionToken} from '@angular/core';
import {AuthService} from "./auth.service";

export interface FeatureToggle {
    isActive(toggleName: string): boolean;
    isActiveByToggleOrRole(toggleName: string, roleName: String): boolean;
}

export const FEATURE_CREATE_STRATEGY = 'createStrategy';
export const FEATURE_STRATEGY_SELL_WHEN_SECOND_CURRENCY_GROWS = 'strategySellWhenSecondCurrencyGrows';
export const FEATURE_STRATEGY_SELL_NOW = 'strategySellNow';
export const FEATURE_STRATEGY_BUY_NOW = 'strategyBuyNow';
export const FEATURE_HEALTH = 'health';
export const FEATURE_CLIENT_SIDE_ORDER = 'clientSideOrder';

export const ROLE_CLIENT_SIDE_ORDER = 'ROLE_CLIENT_SIDE_ORDER';

export const FeatureToggleToken = new InjectionToken('FeatureToggle');

@Injectable()
export class LocalStorageFeatureToggle implements FeatureToggle {

    constructor(private authService: AuthService) {
    }

    isActive(toggleName: string): boolean {
        const localStorageToggle = localStorage.getItem(`toggle.${toggleName}`);
        if (localStorageToggle != null) {
            return localStorageToggle === 'true';
        } else {
            return this.isActiveByDefault(toggleName);
        }
    }

    isActiveByToggleOrRole(toggleName: string, roleName: string): boolean {
        return this.isActive(toggleName) || this.authService.isRoleAssignedToUser(roleName)
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
