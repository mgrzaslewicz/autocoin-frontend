import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastService} from '../../../services/toast.service';
import {ExchangeUsersService} from '../../../services/api';

@Component({
    selector: 'app-exchange-user-create',
    templateUrl: './exchange-user-create.component.html',
    styleUrls: ['./exchange-user-create.component.scss']
})
export class ExchangeUserCreateComponent implements OnInit {

    public loading = false;

    constructor(
        private router: Router,
        private toastService: ToastService,
        private exchangeUsersService: ExchangeUsersService
    ) {
    }

    ngOnInit() {
    }

    onSubmit(createForm) {
        this.loading = true;

        this.exchangeUsersService.createExchangeUser({name: createForm.value.name})
            .subscribe(() => {
                this.toastService.success('Exchange user has been created.');
                this.router.navigate(['/exchange-users']);
            }, error => {
                this.toastService.danger(error.message);
                this.loading = false;
            });

    }

}
