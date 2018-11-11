import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ExchangeUser } from '../../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';
import { ExchangeUsersService } from '../../../services/api/index';

@Component({
  selector: 'app-client-delete',
  templateUrl: './client-delete.component.html',
  styleUrls: ['./client-delete.component.scss']
})
export class ClientDeleteComponent implements OnInit {

  private client: ExchangeUser;

  @ViewChild('content')
  content;

  @Output('refresh')
  refreshEmmiter: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private toastService: ToastService,
    private exchangeUsersService: ExchangeUsersService
  ) { }

  ngOnInit() {
  }

  destroy(client: ExchangeUser) {
    this.client = client;
    
    this.modalService.open(this.content).result.then(result => {
      if (result === 'delete') {
        this.deleteExchangeUser(client);
      }
    }, reason => { });
  }

  private deleteExchangeUser(exchangeUser: ExchangeUser) {
    this.exchangeUsersService.deleteExchangeUser(exchangeUser.id)
      .subscribe(() => {
        this.toastService.success('User has been deleted.');
        this.refreshEmmiter.emit(null);
      }, error => {
        this.toastService.danger(error.message);
      });
  }

}
