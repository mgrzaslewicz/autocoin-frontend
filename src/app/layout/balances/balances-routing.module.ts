import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExchangeWalletsComponent } from './exchange-wallets/exchange-wallets.component';

const routes: Routes = [
  {
    path: 'exchange', component: ExchangeWalletsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalancesRoutingModule { }
