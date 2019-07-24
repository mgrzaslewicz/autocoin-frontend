import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {AllowOnlyLoggedInGuard, AllowOnlyShouldNotChangePasswordGuard} from '../shared/guard';

export const apiKeysRoute = 'api-keys';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {path: '', redirectTo: 'dashboard'},
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule',
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: apiKeysRoute,
                loadChildren: `./exchange-users/exchange-users.module#ExchangeUsersModule`,
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'wallets',
                loadChildren: './wallets/wallets.module#WalletsModule',
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'trading-automation',
                loadChildren: './trading-automation/trading-strategy.module#TradingStrategyModule',
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'orders',
                loadChildren: './orders/orders.module#OrdersModule',
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'health',
                loadChildren: './health/health.module#HealthModule',
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'settings',
                loadChildren: './settings/settings.module#SettingsModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {
}
