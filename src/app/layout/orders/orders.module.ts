import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { PageHeaderModule } from '../../shared';
import { OrdersComponent } from './orders.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    OrdersRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
  ],
  declarations: [
    OrdersComponent
  ]
})
export class OrdersModule { }
