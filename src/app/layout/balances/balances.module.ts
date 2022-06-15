import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageHeaderModule} from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {BalancesRoutingModule} from './balances-routing.module';
import {ExchangeBalanceComponent} from "./exchange-balance/exchange-balance.component";
import {BlockchainWalletBalanceComponent} from "./blockchain-wallet-balance/blockchain-wallet-balance.component";
import {FormsModule} from "@angular/forms";
import {WalletsInputParser} from "./blockchain-wallet-balance/wallets-input-parser";
import {DialogModule} from "../../dialog/dialog.module";
import {BalancesMenuComponent} from "./balances-menu.component";

@NgModule({
    imports: [
        CommonModule,
        BalancesRoutingModule,
        PageHeaderModule,
        NgbModule,
        FormsModule,
        DialogModule
    ],
    declarations: [
        BalancesMenuComponent,
        ExchangeBalanceComponent,
        BlockchainWalletBalanceComponent
    ],
    providers: [
        WalletsInputParser
    ]
})
export class BalancesModule {
}
