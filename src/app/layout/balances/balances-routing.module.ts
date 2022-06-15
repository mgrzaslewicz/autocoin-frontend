import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlockchainWalletBalanceComponent} from "./blockchain-wallet-balance/blockchain-wallet-balance.component";
import {ExchangeBalanceComponent} from "./exchange-balance/exchange-balance.component";

const routes: Routes = [
    {
        path: 'wallets', component: BlockchainWalletBalanceComponent,
    },
    {
        path: 'exchanges', component: ExchangeBalanceComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BalancesRoutingModule {
}
