import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {AuthService} from "../../services/auth.service";

enum BalanceView {
    Wallets = 1,
    Coins,
    Exchanges,
    Summary,
}

@Component({
    selector: 'app-balances',
    templateUrl: './balances.component.html',
    styleUrls: ['./balances.component.scss'],
    animations: [routerTransition()]
})
export class BalancesComponent implements OnInit {
    walletsView = BalanceView.Wallets;
    coinsView = BalanceView.Coins;
    exchangesView = BalanceView.Exchanges;
    summaryView = BalanceView.Summary;

    selectedView: BalanceView = BalanceView.Wallets;

    constructor(
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon()
            .subscribe(() => {
            });
    }

    selectView(view: BalanceView) {
        this.selectedView = view;
    }
}
