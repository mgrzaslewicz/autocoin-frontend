import {Component, Inject, OnInit} from '@angular/core';
import {FeatureToggle, FeatureToggleToken} from '../../services/feature.toogle.service';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    shouldChangePassword = false;

    constructor(@Inject(FeatureToggleToken) private featureToggle: FeatureToggle,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.shouldChangePassword = this.authService.shouldChangePassword();
    }

}
