import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruncateModule } from 'ng2-truncate';

import { UsersComponent } from './users.component';
import { PageHeaderModule } from '../../shared';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersRoutingModule } from './users-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    UsersRoutingModule,
    FormsModule,
    NgbModule.forRoot(),
    TruncateModule
  ],
  declarations: [
    UsersComponent,
    UserEditComponent,
    UserCreateComponent,
    UserDeleteComponent
  ]
})
export class UsersModule { }
