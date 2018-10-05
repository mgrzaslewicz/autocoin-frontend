import {Component, Inject, OnInit} from '@angular/core';
import {FEATURE_2FA, FeatureToggle, FeatureToggleToken} from '../../services/feature.toogle.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    constructor(@Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
    }

    ngOnInit() {
    }

    public isShowingTwoFactorAuthentication(): boolean {
        return this.featureToggle.isActive(FEATURE_2FA);
    }

}
