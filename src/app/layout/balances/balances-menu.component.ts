import {Component, Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {routerTransition} from "../../router.animations";

@Component({
    selector: 'app-balances-menu',
    templateUrl: './balances-menu.component.html',
    styleUrls: ['./balances-menu.component.scss'],
    animations: [routerTransition()]
})
export class BalancesMenuComponent {
    constructor(public router: Router) {
    }
}
