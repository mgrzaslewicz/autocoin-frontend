import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ArbitrageMonitorComponent} from './arbitrage-monitor.component';

const routes: Routes = [
  {
    path: '', component: ArbitrageMonitorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArbitrageMonitorRoutingModule { }
