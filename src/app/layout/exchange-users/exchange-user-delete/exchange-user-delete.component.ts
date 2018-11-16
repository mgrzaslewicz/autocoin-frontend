import {Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {ExchangeUser} from '../../../models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../services/toast.service';
import {ExchangeUsersService} from '../../../services/api/index';

@Component({
    selector: 'app-exchange-user-delete',
    templateUrl: './exchange-user-delete.component.html',
    styleUrls: ['./exchange-user-delete.component.scss']
})
export class ExchangeUserDeleteComponent implements OnInit {

    private exchangeUser: ExchangeUser;

    @ViewChild('content')
    content;

    @Output('refresh')
    refreshEmmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private modalService: NgbModal,
        private toastService: ToastService,
        private exchangeUsersService: ExchangeUsersService
    ) {
    }

    ngOnInit() {
    }

    destroy(exchangeUser: ExchangeUser) {
        this.exchangeUser = exchangeUser;

        this.modalService.open(this.content).result.then(result => {
            if (result === 'delete') {
                this.deleteExchangeUser(exchangeUser);
            }
        }, reason => {
        });
    }

    private deleteExchangeUser(exchangeUser: ExchangeUser) {
        this.exchangeUsersService.deleteExchangeUser(exchangeUser.id)
            .subscribe(() => {
                this.toastService.success('User has been deleted.');
                this.refreshEmmitter.emit(null);
            }, error => {
                this.toastService.danger(error.message);
            });
    }

}
