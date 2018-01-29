import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients.component';
import { ClientCreateComponent } from './client-create/client-create.component';
import { ClientEditComponent } from './client-edit/client-edit.component';

const routes: Routes = [
  {
    path: '', component: ClientsComponent,
  },
  {
    path: 'create', component: ClientCreateComponent
  },
  {
    path: 'edit/:clientId', component: ClientEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
