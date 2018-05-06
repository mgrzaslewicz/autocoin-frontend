import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutomationRoutingModule } from './automation-routing.module';
import { AutomationComponent } from './automation.component';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StrategiesService } from '../../services/automation/strategies.service';
import { ExchangesService } from '../../services/automation/exchanges.service';
import { MakeOrderComponent } from './make-order/make-order.component';
import { ValidatorsModule } from '../../validators/validators.module';
import { FormsModule } from '@angular/forms';
import { StrategiesExecutionsService } from '../../services/automation/strategies-executions.service';

@NgModule({
  imports: [
    CommonModule,
    AutomationRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    ValidatorsModule,
    FormsModule,
  ],
  declarations: [AutomationComponent, MakeOrderComponent],
  providers: [
    StrategiesService,
    StrategiesExecutionsService,
    ExchangesService
  ]
})
export class AutomationModule { }
