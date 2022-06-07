import {Component, Inject} from '@angular/core';
import {FEATURE_HEALTH, FeatureToggle, FeatureToggleToken} from '../../../services/feature.toogle.service';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    isActive = false;
    isHealthTabAvailable = false;
    showMenu = '';

    constructor(
        @Inject(FeatureToggleToken) private featureToggle: FeatureToggle,
        private authService: AuthService,
        private router: Router
    ) {
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

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
