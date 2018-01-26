import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { WalletsRoutingModule } from './wallets-routing.module';
import { WalletsComponent } from './wallets.component';

@NgModule({
  imports: [
    CommonModule,
    WalletsRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
  ],
  declarations: [WalletsComponent]
})
export class WalletsModule { }
