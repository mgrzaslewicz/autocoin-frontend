import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.check()) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
