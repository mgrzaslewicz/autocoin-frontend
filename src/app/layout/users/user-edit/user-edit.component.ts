import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { MarketsService } from '../../../services/markets.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  animations: [routerTransition()]
})
export class UserEditComponent implements OnInit {

  private markets = [];

  private user: User;

  constructor(
    private marketsService: MarketsService,
    private usersService: UsersService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.markets = this.marketsService.get();
    this.route.params
      .switchMap(params => {
        return this.usersService.find(params.userId);
      }).subscribe(user => {
        console.log(user);
        this.user = user;
      });
  }

  onSubmit() {
    console.log(this.user);

    this.toastService.success('User data has been updated.');
    this.router.navigate(['/users']);
  }

}
