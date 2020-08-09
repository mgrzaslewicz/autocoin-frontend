import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientSideOrdersRoutingModule} from "./client-side-orders-routing.module";
import {ClientSideOrdersComponent} from "./client-side-orders.component";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
    imports: [
        CommonModule,
        ClientSideOrdersRoutingModule,
        FormsModule,
        NgSelectModule
    ],
    declarations: [
        ClientSideOrdersComponent
    ]
})
export class ClientSideOrdersModule {
}
