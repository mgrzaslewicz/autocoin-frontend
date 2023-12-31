import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PageHeaderModule, SharedPipesModule} from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ArbitrageMonitorRoutingModule} from './arbitrage-monitor-routing.module';
import {ArbitrageMonitorComponent} from './arbitrage-monitor.component';
import {TwoLegArbitrageProfitStatisticTileComponent} from './two-leg-arbitrage-monitor-profit-statistic-tile/two-leg-arbitrage-profit-statistic-tile.component';
import {FormsModule} from '@angular/forms';
import {TwoLegArbitrageOpportunitiesTableComponent} from './two-leg-arbitrage-opportunities-table/two-leg-arbitrage-opportunities-table.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {TwoLegArbitrageOpportunityDialog} from "./two-leg-arbitrage-opportunities-table/two-leg-arbitrag-opportunity-dialog/two-leg-arbitrage-opportunity-dialog";
import {DialogModule} from "../../dialog/dialog.module";

@NgModule({
    imports: [
        CommonModule,
        ArbitrageMonitorRoutingModule,
        PageHeaderModule,
        NgbModule,
        FormsModule,
        NgSelectModule,
        SharedPipesModule,
        DialogModule
    ],
    declarations: [
        ArbitrageMonitorComponent,
        TwoLegArbitrageProfitStatisticTileComponent,
        TwoLegArbitrageOpportunitiesTableComponent,
        TwoLegArbitrageOpportunityDialog
    ]
})
export class ArbitrageMonitorModule {
}
