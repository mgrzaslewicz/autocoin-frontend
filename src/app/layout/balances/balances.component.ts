import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-balances',
    templateUrl: './balances.component.html',
    styleUrls: ['./balances.component.scss'],
    animations: [routerTransition()]
})
export class BalancesComponent implements OnInit {

    constructor(
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.refreshTokenIfExpiringSoon()
            .subscribe(() => {
            });
    }

}
