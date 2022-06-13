import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BalancesRoutingModule } from './balances-routing.module';
import { ExchangeWalletsComponent } from './exchange-wallets/exchange-wallets.component';
import {BalancesComponent} from "./balances.component";

@NgModule({
  imports: [
    CommonModule,
    BalancesRoutingModule,
    PageHeaderModule,
    NgbModule,
  ],
  declarations: [BalancesComponent, ExchangeWalletsComponent]
})
export class BalancesModule { }
