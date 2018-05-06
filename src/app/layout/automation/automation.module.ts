import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutomationRoutingModule } from './automation-routing.module';
import { AutomationComponent } from './automation.component';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StrategiesService } from '../../services/automation/strategies.service';
import { ExchangesService } from '../../services/automation/exchanges.service';
import { MakeStrategyExecutionComponent } from './make-strategy-execution/make-strategy-execution.component';
import { ValidatorsModule } from '../../validators/validators.module';
import { FormsModule } from '@angular/forms';
import { StrategiesExecutionsService } from '../../services/automation/strategies-executions.service';
import { BuyLowerAndLowerSpecificParametersComponent } from './make-strategy-execution/buy-lower-and-lower-specific-parameters/buy-lower-and-lower-specific-parameters.component';

@NgModule({
  imports: [
    CommonModule,
    AutomationRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    ValidatorsModule,
    FormsModule,
  ],
  declarations: [AutomationComponent, MakeStrategyExecutionComponent, BuyLowerAndLowerSpecificParametersComponent],
  providers: [
    StrategiesService,
    StrategiesExecutionsService,
    ExchangesService
  ]
})
export class AutomationModule { }
