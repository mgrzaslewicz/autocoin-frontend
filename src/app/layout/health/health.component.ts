import {Component, OnInit} from '@angular/core';
import {ExchangeHealthDto, HealthService} from '../../services/health.service';
import {ToastService} from '../../services/toast.service';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-health',
    templateUrl: 'health.component.html',
    styleUrls: ['health.component.scss']
})
export class HealthComponent implements OnInit {
    exchangesHealth: Array<ExchangeHealthDto> = [];

    constructor(private healthService: HealthService,
                private toastService: ToastService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon().subscribe(() => {
            this.getExchangesHealth();
        });
    }

    private getExchangesHealth() {
        this.healthService.getExchangesHealth().subscribe(
            healthDtoList => {
                // order: healthy, can read prices, not healthy
                healthDtoList.sort((a, b) => {
                    if (a.healthy === false && b.healthy === true) {
                        return 1;
                    } else if (a.healthy === true && b.healthy === false) {
                        return -1;
                    } else if (a.canGetPublicMarketData === true && b.canGetPublicMarketData === false) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                this.exchangesHealth = healthDtoList;
            },
            error => {
                this.toastService.warning('Could not get exchanges health');
            }
        );
    }

}
