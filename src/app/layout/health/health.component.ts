import {Component, OnInit} from '@angular/core';
import {ExchangeHealthDto, HealthService} from '../../services/health.service';
import {ToastService} from '../../services/toast.service';
import {AuthService} from '../../services/auth.service';
import { isNumeric } from 'rxjs/internal/util/isNumeric';

@Component({
    selector: 'app-health',
    templateUrl: 'health.component.html',
    styleUrls: ['health.component.scss']
})
export class HealthComponent implements OnInit {
    exchangesHealthGroupedByCategory: Map<String, Array<ExchangeHealthDto>> = new Map<String, Array<ExchangeHealthDto>>();
    exchangesHealth: Array<ExchangeHealthDto>;
    capabilities: string[];

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
        return Array.from(this.exchangesHealthGroupedByCategory.keys());
    }

    private getExchangesHealth() {
        this.healthService.getExchangesHealth().subscribe(
            healthDtoList => {
                this.exchangesHealth = healthDtoList;
                this.capabilities = this.extractCapabilitiesFromExchangesHealth();
                console.log(healthDtoList);
                this.exchangesHealthGroupedByCategory.set('Unhealthy', healthDtoList.filter(it =>
                    !it.canGetPublicMarketData
                ).sort((a, b) => {
                    return a.exchangeName.localeCompare(b.exchangeName);
                }));
                this.exchangesHealthGroupedByCategory.set('Ok for public data', healthDtoList.filter(it => {
                    return it.canGetPublicMarketData;
                }).sort((a, b) => {
                    return a.exchangeName.localeCompare(b.exchangeName);
                }));
                this.exchangesHealthGroupedByCategory.set('Ok for detailed arbitrage monitoring', healthDtoList.filter(it => {
                    return it.okForDetailedArbitrage;
                }).sort((a, b) => {
                    return a.exchangeName.localeCompare(b.exchangeName);
                }));
                this.exchangesHealthGroupedByCategory.set('Ok for trading', healthDtoList.filter(it => {
                    return it.healthy;
                }).sort((a, b) => {
                    return a.exchangeName.localeCompare(b.exchangeName);
                }));
                this.exchangesHealthGroupedByCategory.set('All exchanges', healthDtoList.sort((a, b) => {
                    return a.exchangeName.localeCompare(b.exchangeName);
                }));
                console.log(this.exchangesHealthGroupedByCategory);
            },
            error => {
                this.toastService.warning('Could not get exchanges health');
            }
        );
    }

    hasNoExchangesInCategory(exchangeHealthCategory: String) {
        const exchanges = this.exchangesHealthGroupedByCategory.get(exchangeHealthCategory);
        return exchanges === undefined || exchanges === null || exchanges.length === 0;
    }

    private extractCapabilitiesFromExchangesHealth(): string[] {
        return this.exchangesHealth[0].capabilities.map(it => {return it.name});
    }

    isNumeric(value: string): boolean {
        return isNumeric(value);
    }
}
