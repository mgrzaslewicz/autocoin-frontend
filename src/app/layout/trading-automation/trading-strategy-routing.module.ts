import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TradingStrategiesComponent} from './trading-strategies.component';
import {AddStrategyExecutionComponent} from './add-strategy-execution/add-strategy-execution.component';

const routes: Routes = [
    {
        path: '', component: TradingStrategiesComponent
    },
    {
        path: 'add-strategy-execution/:exchangeName', component: AddStrategyExecutionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TradingStrategyRoutingModule {
}
