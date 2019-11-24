import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PageHeaderModule} from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ArbitrageMonitorRoutingModule} from './arbitrage-monitor-routing.module';
import {ArbitrageMonitorComponent} from './arbitrage-monitor.component';
import {TwoLegArbitrageProfitTileComponent} from './two-leg-arbitrage-monitor-profit-tile/two-leg-arbitrage-profit-tile.component';
import {TwoLegArbitrageProfitStatisticTileComponent} from './two-leg-arbitrage-monitor-profit-statistic-tile/two-leg-arbitrage-profit-statistic-tile.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ArbitrageMonitorRoutingModule,
        PageHeaderModule,
        NgbModule,
        FormsModule
    ],
    declarations: [
        ArbitrageMonitorComponent,
        TwoLegArbitrageProfitTileComponent,
        TwoLegArbitrageProfitStatisticTileComponent
    ]
})
export class ArbitrageMonitorModule {
}
