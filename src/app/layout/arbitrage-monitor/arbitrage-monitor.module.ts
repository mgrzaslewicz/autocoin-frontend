import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PageHeaderModule} from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ArbitrageMonitorRoutingModule} from './arbitrage-monitor-routing.module';
import {ArbitrageMonitorComponent} from './arbitrage-monitor.component';

@NgModule({
  imports: [
    CommonModule,
    ArbitrageMonitorRoutingModule,
    PageHeaderModule,
    NgbModule,
  ],
  declarations: [
    ArbitrageMonitorComponent
  ]
})
export class ArbitrageMonitorModule { }
