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
    exchangesHealth: Map<String, Array<ExchangeHealthDto>> = new Map<String, Array<ExchangeHealthDto>>();

    constructor(private healthService: HealthService,
                private toastService: ToastService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon().subscribe(() => {
            this.getExchangesHealth();
        });
    }

    healthCategories(): String[] {
        return Array.from(this.exchangesHealth.keys());
    }

    private getExchangesHealth() {
        this.healthService.getExchangesHealth().subscribe(
            healthDtoList => {
                console.log(healthDtoList);
                this.exchangesHealth.set('Unhealthy', healthDtoList.filter(it =>
                    !it.canGetPublicMarketData
                ).sort((a, b) => {
                    return a.exchangeName.localeCompare(b.exchangeName);
                }));
                this.exchangesHealth.set('Ok for public data', healthDtoList.filter(it => {
                    return it.canGetPublicMarketData;
                }).sort((a, b) => {
                    return a.exchangeName.localeCompare(b.exchangeName);
                }));
                this.exchangesHealth.set('Ok for detailed arbitrage monitoring', healthDtoList.filter(it => {
                    return it.okForDetailedArbitrage;
                }).sort((a, b) => {
                    return a.exchangeName.localeCompare(b.exchangeName);
                }));
                this.exchangesHealth.set('Ok for trading', healthDtoList.filter(it => {
                    return it.healthy;
                }).sort((a, b) => {
                    return a.exchangeName.localeCompare(b.exchangeName);
                }));
                console.log(this.exchangesHealth);
            },
            error => {
                this.toastService.warning('Could not get exchanges health');
            }
        );
    }

    hasNoExchangesInCategory(exchangeHealthCategory: String) {
        const exchanges = this.exchangesHealth.get(exchangeHealthCategory);
        return exchanges === undefined || exchanges === null || exchanges.length === 0;
    }

}
