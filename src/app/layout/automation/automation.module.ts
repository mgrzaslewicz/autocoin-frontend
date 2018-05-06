import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutomationRoutingModule } from './automation-routing.module';
import { AutomationComponent } from './automation.component';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StrategiesService } from '../../services/automation/strategies.service';
import { ExchangesService } from '../../services/automation/exchanges.service';

@NgModule({
  imports: [
    CommonModule,
    AutomationRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot()
  ],
  declarations: [AutomationComponent],
  providers: [
    StrategiesService,
    ExchangesService
  ]
})
export class AutomationModule { }
