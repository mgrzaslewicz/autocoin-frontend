import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ExchangeUserEditComponent} from './exchange-user-edit/exchange-user-edit.component';
import {ExchangeUsersComponent} from './exchange-users.component';
import {ExchangeUserCreateComponent} from './exchange-user-create/exchange-user-create.component';

const routes: Routes = [
    {path: '', component: ExchangeUsersComponent},
    {path: 'create', component: ExchangeUserCreateComponent},
    {path: 'edit/:exchangeUserId', component: ExchangeUserEditComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExchangeUsersRoutingModule {
}
