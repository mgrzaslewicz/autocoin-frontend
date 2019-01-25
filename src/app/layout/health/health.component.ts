import {Component, OnInit} from '@angular/core';
import {HealthService} from '../../services/health.service';

@Component({
    selector: 'app-health',
    templateUrl: 'health.component.html',
    styleUrls: ['health.component.scss']
})
export class HealthComponent {

    healthService = null;

    constructor(healthService: HealthService) {
        this.healthService = healthService;
    }

}
