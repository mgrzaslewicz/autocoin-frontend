import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class AllowOnlyLoggedInGuard implements CanActivate {
    constructor(private router: Router,
                private authService: AuthService) {
    }

    canActivate(): boolean {
        if (!this.authService.oauthTokenExists()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
