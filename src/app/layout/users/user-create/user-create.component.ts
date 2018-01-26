import { Component, OnInit } from '@angular/core';
import { MarketsService } from '../../../services/markets.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  animations: [routerTransition()]
})
export class UserCreateComponent implements OnInit {

  public markets = [];

  public user: User;

  constructor(
    private marketsService: MarketsService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.markets = this.marketsService.get();
    this.user = new User;
  }

  onSubmit() {
    //console.log(this.user);

    this.toastService.success('User has been created.');
    this.router.navigate(['/users']);
  }

}
