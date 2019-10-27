import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PageHeaderModule} from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ValidatorsModule} from '../../validators/validators.module';
import {ExchangeUsersComponent} from './exchange-users.component';
import {ApiKeysRoutingModule} from './api-keys-routing.module';
import {ExchangeUserEditComponent} from './exchange-user-edit/exchange-user-edit.component';
import {ExchangeUserCreateComponent} from './exchange-user-create/exchange-user-create.component';
import {ExchangeUserDeleteComponent} from './exchange-user-delete/exchange-user-delete.component';

@NgModule({
    imports: [
        CommonModule,
        PageHeaderModule,
        ApiKeysRoutingModule,
        ValidatorsModule,
        FormsModule,
        NgbModule.forRoot()
    ],
    declarations: [
        ExchangeUsersComponent,
        ExchangeUserCreateComponent,
        ExchangeUserDeleteComponent,
        ExchangeUserEditComponent
    ]
})
export class ApiKeysModule {
}
