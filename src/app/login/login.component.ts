import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { ToastService } from '../services/toast.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    @ViewChild('loginForm')
    public loginForm: NgForm;

    constructor(
        public router: Router,
        private authService: AuthService,
        private toastService: ToastService
    ) {}

    ngOnInit() { }

    onLogIn(loginForm) {
        this.authService.login(loginForm.value.email, loginForm.value.password)
            .subscribe(response => {
                
                this.router.navigate(['/dashboard']);

            }, response => {

                if (response.error.error == 'invalid_grant') {
                    this.toastService.danger('Wrong username or password.');
                } else {
                    this.toastService.danger('Service is unavailable. Try again later.');
                }
                
            });
    }
}
