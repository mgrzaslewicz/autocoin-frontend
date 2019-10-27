import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from '../../../models/order';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-order-delete',
  templateUrl: './order-delete.component.html',
  styleUrls: ['./order-delete.component.scss']
})
export class OrderDeleteComponent implements OnInit {

  order: Order;

  @ViewChild('content', { static: true })
  content;

  constructor(
    private modalService: NgbModal,
    private toastService: ToastService
  ) { }

  ngOnInit() {
  }

  destroy(order: Order) {
    this.order = order;

    this.modalService.open(this.content).result.then(result => {
      if (result === 'delete') {
        this.toastService.success('Order has been cancelled.');
      }
    }, reason => { });
  }

}
