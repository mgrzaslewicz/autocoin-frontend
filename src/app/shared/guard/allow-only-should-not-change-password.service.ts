import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class AllowOnlyShouldNotChangePasswordGuard implements CanActivate {
    constructor(private router: Router,
                private authService: AuthService) {
    }

    canActivate(): boolean | UrlTree {
        if (this.authService.shouldChangePassword()) {
            return this.router.parseUrl('settings');
        } else {
            return true;
        }
    }
}
