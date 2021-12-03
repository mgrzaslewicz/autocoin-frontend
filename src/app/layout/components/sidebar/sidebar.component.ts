import {Component, Inject} from '@angular/core';
import {
    FeatureToggle,
    FeatureToggleToken,
    FEATURE_HEALTH
} from '../../../services/feature.toogle.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    isActive = false;
    isHealthTabAvailable = false;
    showMenu = '';

    constructor(@Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
        this.isHealthTabAvailable = featureToggle.isActive(FEATURE_HEALTH);
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
}
