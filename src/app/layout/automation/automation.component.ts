import { Component, OnInit } from '@angular/core';
import { StrategiesService } from '../../services/strategies.service';
import { Observable } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { Exchange } from '../../models';
import { ExchangesService } from '../../services/automation/exchanges.service';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {

  private exchanges: Exchange[];

  constructor(
    private toastService: ToastService,
    private exchangesService: ExchangesService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    Observable.forkJoin(
      this.exchangesService.getExchanges()
    ).subscribe(([exchanges]) => {
      this.exchanges = exchanges;
    }, error => {
      this.toastService.danger('Sorry, something went wrong.');
    });
  }
}
