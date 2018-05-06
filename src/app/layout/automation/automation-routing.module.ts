import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutomationComponent } from './automation.component';
import { MakeOrderComponent } from './make-order/make-order.component';

const routes: Routes = [
  {
    path: '', component: AutomationComponent,
  },
  {
    path: 'make-order/:exchangeName', component: MakeOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutomationRoutingModule { }
