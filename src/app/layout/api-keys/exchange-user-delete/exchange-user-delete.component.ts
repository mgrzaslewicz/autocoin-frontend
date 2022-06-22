import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ExchangeUserDto} from '../../../models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../services/toast.service';
import {ExchangeUsersService} from '../../../services/api/index';

@Component({
    selector: 'app-exchange-user-delete',
    templateUrl: './exchange-user-delete.component.html',
    styleUrls: ['./exchange-user-delete.component.scss']
})
export class ExchangeUserDeleteComponent implements OnInit {

    private exchangeUser: ExchangeUserDto;

    @ViewChild('content', { static: true })
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

    deleteExchangeUserWithConfirmation(exchangeUser: ExchangeUserDto) {
        this.exchangeUser = exchangeUser;

        this.modalService.open(this.content).result.then(result => {
            if (result === 'delete') {
                this.doDeleteExchangeUser(exchangeUser);
            }
        }, reason => {
        });
    }

    private doDeleteExchangeUser(exchangeUser: ExchangeUserDto) {
        this.exchangeUsersService.deleteExchangeUser(exchangeUser.id)
            .subscribe(() => {
                this.toastService.success('User has been deleted.');
                this.refreshEmmitter.emit(null);
            }, error => {
                this.toastService.danger(error.message);
            });
    }

}
