import {Injectable, InjectionToken} from '@angular/core';

export interface FeatureToggle {
    isActive(toggleName: string): boolean;
}

export const FEATURE_CREATE_STRATEGY = 'createStrategy';

export const FeatureToggleToken = new InjectionToken('FeatureToggle');

@Injectable()
export class LocalStorageFeatureToggle implements FeatureToggle {
    isActive(toggleName: string): boolean {
        return localStorage.getItem(`toggle.${toggleName}`) === 'true';
    }
}
