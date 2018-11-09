import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Client } from '../../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';
import { ExchangeUsersService } from '../../../services/api/index';

@Component({
  selector: 'app-client-delete',
  templateUrl: './client-delete.component.html',
  styleUrls: ['./client-delete.component.scss']
})
export class ClientDeleteComponent implements OnInit {

  private client: Client;

  @ViewChild('content')
  content;

  @Output('refresh')
  refreshEmmiter: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private toastService: ToastService,
    private clientsService: ExchangeUsersService
  ) { }

  ngOnInit() {
  }

  destroy(client: Client) {
    this.client = client;
    
    this.modalService.open(this.content).result.then(result => {
      if (result === 'delete') {
        this.deleteClient(client);
      }
    }, reason => { });
  }

  private deleteClient(client: Client) {
    this.clientsService.deleteClient(client.id)
      .subscribe(() => {
        this.toastService.success('User has been deleted.');
        this.refreshEmmiter.emit(null);
      }, error => {
        this.toastService.danger(error.message);
      });
  }

}
