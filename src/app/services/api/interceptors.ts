import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class Oauth2TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
                private router: Router) {
    }

    private addOauth2BearerToken(request: HttpRequest<any>): HttpRequest<any> {
        if (request.headers && request.headers.has('Authorization')) {
            return request;
        } else {
            return request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authService.token()}`
                }
            });
        }
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

    private handleExpiredToken(response: any) {
        if (response instanceof HttpErrorResponse) {
            console.error(response);
            // eg {error: "invalid_token", error_description: "Access token expired: 280a56ce-cc30-4627-81fa-ced664d7863f"}
            // {"error":"unauthorized","error_description":"Full authentication is required to access this resource"}
            if (response.status === 401) {
                console.log('Handling unauthorized 401 response');
                if (response.error && (response.error.error === 'invalid_token' || response.error.error === 'unauthorized')
                ) {
                    console.log('Token has expired, redirecting to login');
                } else {
                    console.log('Unknown reason for authorization error, redirecting to login');
                }
                this.authService.logout();
                this.redirectToLogin();
            } else if (response.status === 400) {
                console.log('Handling unauthorized 400 response');
                if (response.error && (response.error.error === 'invalid_grant')) {
                    console.log('Refresh token failed, redirecting to login');
                    this.authService.logout();
                    this.redirectToLogin();
                }
            }
        }
    }

    private redirectToLogin() {
        this.router.navigate(['/login']);
    }
}

