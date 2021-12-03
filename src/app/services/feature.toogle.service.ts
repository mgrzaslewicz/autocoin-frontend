import {Injectable, InjectionToken} from '@angular/core';
import {AuthService} from "./auth.service";

export interface FeatureToggle {
    isActive(toggleName: string): boolean;
    isActiveByToggleOrRole(toggleName: string, roleName: String): boolean;
}

export const FEATURE_HEALTH = 'health';

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
        ].includes(toggleName);
    }

}
