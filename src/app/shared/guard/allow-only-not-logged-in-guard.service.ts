import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class AllowOnlyNotLoggedInGuard implements CanActivate {
    constructor(private router: Router,
                private authService: AuthService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        if (this.authService.oauthTokenExists()) {
            this.router.navigate(['/dashboard']);
            return false;
        } else {
            return true;
        }
    }
}
