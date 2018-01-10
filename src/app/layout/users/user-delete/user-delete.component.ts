import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {

  private user: User;

  @ViewChild('content')
  content;

  constructor(
    private modalService: NgbModal,
    private toastService: ToastService
  ) { }

  ngOnInit() {
  }

  destroy(user: User) {
    this.user = user;
    
    this.modalService.open(this.content).result.then(result => {
      if (result === 'delete') {
        this.toastService.success('User has been deleted.');
      }
    }, reason => { });
  }

}
