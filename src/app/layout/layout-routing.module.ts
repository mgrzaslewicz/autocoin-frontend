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
            { path: 'clients', loadChildren: './clients/clients.module#ClientsModule' },
            { path: 'wallets', loadChildren: './wallets/wallets.module#WalletsModule' },
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
