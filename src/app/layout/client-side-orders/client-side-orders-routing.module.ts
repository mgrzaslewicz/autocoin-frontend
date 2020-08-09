import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClientSideOrdersComponent} from "./client-side-orders.component";

const routes: Routes = [
  {
    path: '', component: ClientSideOrdersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientSideOrdersRoutingModule { }
