import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TradingStrategiesComponent} from './trading-strategies.component';
import {PageHeaderModule} from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AddStrategyExecutionComponent} from './add-strategy-execution/add-strategy-execution.component';
import {ValidatorsModule} from '../../validators/validators.module';
import {FormsModule} from '@angular/forms';
import {BuyLowerAndLowerSpecificParametersComponent} from './add-strategy-execution/buy-lower-and-lower-specific-parameters/buy-lower-and-lower-specific-parameters.component';
import {SellHigherAndHigherSpecificParametersComponent} from './add-strategy-execution/sell-higher-and-higher-specific-parameters/sell-higher-and-higher-specific-parameters.component';
import {SellWhenSecondCurrencyGrowsParametersComponent} from './add-strategy-execution/sell-when-second-currency-grows-parameters/sell-when-second-currency-grows-parameters.component';
import {BuyNowParametersComponent} from './add-strategy-execution/buy-now-parameters/buy-now-parameters.component';
import {SellNowParametersComponent} from './add-strategy-execution/sell-now-parameters/sell-now-parameters.component';
import {TradingStrategyRoutingModule} from './trading-strategy-routing.module';
import {StrategiesService} from '../../services/trading-automation/strategies.service';
import {ExchangesService} from '../../services/trading-automation/exchanges.service';
import {StrategiesExecutionsService} from '../../services/trading-automation/strategies-executions.service';

@NgModule({
    imports: [
        CommonModule,
        TradingStrategyRoutingModule,
        PageHeaderModule,
        NgbModule.forRoot(),
        ValidatorsModule,
        FormsModule
    ],
    declarations: [
        TradingStrategiesComponent,
        AddStrategyExecutionComponent,
        BuyLowerAndLowerSpecificParametersComponent,
        SellHigherAndHigherSpecificParametersComponent,
        SellWhenSecondCurrencyGrowsParametersComponent,
        BuyNowParametersComponent,
        SellNowParametersComponent
    ],
    providers: [
        StrategiesService,
        StrategiesExecutionsService,
        ExchangesService
    ]
})
export class TradingStrategyModule {
}
