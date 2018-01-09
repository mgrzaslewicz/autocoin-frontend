import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserCreateComponent } from './user-create/user-create.component';

const routes: Routes = [
  {
    path: 'edit/:userId', component: UserEditComponent
  },
  {
    path: 'create', component: UserCreateComponent
  },
  {
    path: '', component: UsersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
