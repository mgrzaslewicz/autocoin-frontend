import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutomationRoutingModule } from './automation-routing.module';
import { AutomationComponent } from './automation.component';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    AutomationRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot()
  ],
  declarations: [AutomationComponent]
})
export class AutomationModule { }
