import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {AllowOnlyShouldNotChangePasswordGuard} from '../shared/guard';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {path: '', redirectTo: 'dashboard'},
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'api-keys',
                loadChildren: () => import('./api-keys/api-keys.module').then(m => m.ApiKeysModule),
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'wallets',
                loadChildren: () => import('./wallets/wallets.module').then(m => m.WalletsModule),
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'trading-automation',
                loadChildren: () => import('./trading-automation/trading-strategy.module').then(m => m.TradingStrategyModule),
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'orders',
                loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule),
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'arbitrage-monitor',
                loadChildren: () => import('./arbitrage-monitor/arbitrage-monitor.module').then(m => m.ArbitrageMonitorModule),
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'health',
                loadChildren: () => import('./health/health.module').then(m => m.HealthModule),
                canActivate: [AllowOnlyShouldNotChangePasswordGuard]
            },
            {
                path: 'settings',
                loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
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
