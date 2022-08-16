import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserAdminRoutingModule} from './user-admin-routing.module';
import {PageHeaderModule} from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UserAdminComponent} from './user-admin.component';
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        UserAdminRoutingModule,
        PageHeaderModule,
        NgbModule,
        FormsModule
    ],
    declarations: [
        UserAdminComponent
    ]
})
export class userAdminModule {
}
