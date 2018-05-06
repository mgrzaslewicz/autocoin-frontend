import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutomationComponent } from './automation.component';
import { MakeStrategyExecutionComponent } from './make-strategy-execution/make-strategy-execution.component';

const routes: Routes = [
  {
    path: '', component: AutomationComponent,
  },
  {
    path: 'make-strategy-execution/:exchangeName', component: MakeStrategyExecutionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutomationRoutingModule { }
