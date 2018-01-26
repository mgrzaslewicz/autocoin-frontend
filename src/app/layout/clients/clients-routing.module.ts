import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients.component';
import { ClientCreateComponent } from './client-create/client-create.component';

const routes: Routes = [
  {
    path: '', component: ClientsComponent,
  },
  {
    path: 'create', component: ClientCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
