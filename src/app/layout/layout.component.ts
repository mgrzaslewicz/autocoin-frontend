import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        setInterval(() => {
            this.authService.refreshTokenIfExpiringSoon().subscribe((token: any) => {
                if (token != null) {
                    console.log('Token refreshed in background');
                } else {
                    console.log('Did not need to refresh token');
                }
            });
        }, 60 * 1000);
    }
}
