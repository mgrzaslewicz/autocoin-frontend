import {Component, Inject} from '@angular/core';
import {
    FeatureToggle,
    FeatureToggleToken,
    FEATURE_HEALTH,
    FEATURE_CLIENT_SIDE_ORDER, ROLE_CLIENT_SIDE_ORDER
} from '../../../services/feature.toogle.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    isActive = false;
    isHealthTabAvailable = false;
    isCreateClientSideOrderTabAvailable = false;
    showMenu = '';

    constructor(@Inject(FeatureToggleToken) private featureToggle: FeatureToggle) {
        this.isHealthTabAvailable = featureToggle.isActive(FEATURE_HEALTH);
        this.isCreateClientSideOrderTabAvailable = featureToggle.isActiveByToggleOrRole(FEATURE_CLIENT_SIDE_ORDER, ROLE_CLIENT_SIDE_ORDER);
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
