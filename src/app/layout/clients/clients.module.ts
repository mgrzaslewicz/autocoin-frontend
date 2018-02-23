import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientsRoutingModule } from './clients-routing.module';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ClientsComponent } from './clients.component';
import { ClientCreateComponent } from './client-create/client-create.component';
import { ClientDeleteComponent } from './client-delete/client-delete.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { MakeOrderComponent } from './make-order/make-order.component';
import { ValidatorsModule } from '../../validators/validators.module';
import { CurrenyPairSymbolValidatorDirective } from '../../validators/curreny-pair-symbol-validator.directive';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    ClientsRoutingModule,
    ValidatorsModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  declarations: [
    ClientsComponent, ClientCreateComponent, ClientDeleteComponent, ClientEditComponent, MakeOrderComponent
  ]
})
export class ClientsModule { }
