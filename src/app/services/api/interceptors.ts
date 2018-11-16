import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

@Injectable()
export class Oauth2TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
                private router: Router) {
    }

    private addOauth2BearerToken(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.authService.token()}`
            }
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = this.addOauth2BearerToken(request);
        return next.handle(request).do(
            (event: HttpEvent<any>) => {
            },
            (err: any) => {
                this.handleExpiredToken(err);
            });
    }

    private handleExpiredToken(err: any) {
        if (err instanceof HttpErrorResponse) {
            console.log(err);
            // eg {error: "invalid_token", error_description: "Access token expired: 280a56ce-cc30-4627-81fa-ced664d7863f"}
            if (err.status === 401 && err.error && err.error.error === 'invalid_token') {
                console.log('Token has expired, redirecting to login');
                this.authService.logout();
                this.redirectToLogin();
            }
        }
    }

    private redirectToLogin() {
        this.router.navigate(['/login']);
    }
}

