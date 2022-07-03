import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlockchainWalletBalanceComponent} from "./blockchain-wallet-balance/blockchain-wallet-balance.component";
import {ExchangeBalanceComponent} from "./exchange-balance/exchange-balance.component";
import {BlockchainWalletAddComponent} from "./blockchain-wallet-balance/edit/blockchain-wallet-add.component";
import {CurrencyBalanceSummaryComponent} from "./summary/currency-balance-summary.component";
import {UserCurrencyAssetAddComponent} from "./currency/edit/user-currency-asset-add.component";
import {UserCurrencyAssetBalanceComponent} from "./currency/user-currency-asset-balance.component";

const routes: Routes = [
    {
        path: 'wallets', component: BlockchainWalletBalanceComponent
    },
    {
        path: 'wallets/add', component: BlockchainWalletAddComponent
    },
    {
        path: 'wallets/edit/:walletId', component: BlockchainWalletAddComponent
    },
    {
        path: 'currency-assets', component: UserCurrencyAssetBalanceComponent
    },
    {
        path: 'currency-assets/add', component: UserCurrencyAssetAddComponent
    },
    {
        path: 'currency-assets/edit/:userCurrencyAssetId', component: UserCurrencyAssetAddComponent
    },
    {
        path: 'exchanges', component: ExchangeBalanceComponent
    },
    {
        path: 'summary', component: CurrencyBalanceSummaryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BalancesRoutingModule {
}
