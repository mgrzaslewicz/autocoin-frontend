import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageHeaderModule} from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {BalancesRoutingModule} from './balances-routing.module';
import {ExchangeBalanceComponent} from "./exchange-balance/exchange-balance.component";
import {BlockchainWalletBalanceComponent} from "./blockchain-wallet-balance/blockchain-wallet-balance.component";
import {FormsModule} from "@angular/forms";
import {WalletsInputParser} from "./blockchain-wallet-balance/edit/wallets-input-parser";
import {DialogModule} from "../../dialog/dialog.module";
import {BalancesMenuComponent} from "./balances-menu.component";
import {BlockchainWalletAddComponent} from "./blockchain-wallet-balance/edit/blockchain-wallet-add.component";
import {CurrencyBalanceSummaryComponent} from "./summary/currency-balance-summary.component";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {CurrencyBalanceSummaryDetailsDialog} from "./summary/details-dialog/currency-balance-summary-details-dialog.component";
import {UserCurrencyAssetAddComponent} from "./currency/edit/user-currency-asset-add.component";
import {UserCurrencyAssetBalanceComponent} from "./currency/user-currency-asset-balance.component";
import {CurrencyAssetsInputParser} from "./currency/edit/currency-assets-input-parser.service";

@NgModule({
    imports: [
        CommonModule,
        BalancesRoutingModule,
        PageHeaderModule,
        NgbModule,
        FormsModule,
        DialogModule,
        NgxChartsModule
    ],
    declarations: [
        BalancesMenuComponent,
        ExchangeBalanceComponent,
        BlockchainWalletBalanceComponent,
        BlockchainWalletAddComponent,
        CurrencyBalanceSummaryComponent,
        CurrencyBalanceSummaryDetailsDialog,

        UserCurrencyAssetAddComponent,
        UserCurrencyAssetBalanceComponent
    ],
    providers: [
        WalletsInputParser,
        CurrencyAssetsInputParser
    ]
})
export class BalancesModule {
}
