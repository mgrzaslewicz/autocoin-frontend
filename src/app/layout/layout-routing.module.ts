import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'exchange-users', loadChildren: './exchange-users/exchange-users.module#ExchangeUsersModule' },
            { path: 'wallets', loadChildren: './wallets/wallets.module#WalletsModule' },
            { path: 'automation', loadChildren: './automation/automation.module#AutomationModule' },
            { path: 'orders', loadChildren: './orders/orders.module#OrdersModule' },
            { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
