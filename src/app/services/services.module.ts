import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from './users.service';
import { MarketsService } from './markets.service';
import { ApiService } from './api/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from './toast.service';
import { WatchCurrencyPairsService } from './watch-currency-pairs.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    UsersService,
    MarketsService,
    ApiService,
    ToastService,
    WatchCurrencyPairsService
  ]
})
export class ServicesModule { }
