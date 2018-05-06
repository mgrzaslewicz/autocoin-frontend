import { Component, OnInit } from '@angular/core';
import { StrategiesService } from '../../services/automation/strategies.service';
import { Observable } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { Exchange } from '../../models';
import { ExchangesService } from '../../services/automation/exchanges.service';
import { StrategyExecutionResponseDto } from '../../models/strategy';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {

  private exchanges: Exchange[];

  private strategies: StrategyExecutionResponseDto[];

  constructor(
    private toastService: ToastService,
    private exchangesService: ExchangesService,
    private strategiesService: StrategiesService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    Observable.forkJoin(
      this.exchangesService.getExchanges(),
      this.strategiesService.getStrategies()
    ).subscribe(([exchanges, strategies]) => {
      this.exchanges = exchanges;
      this.strategies = strategies;
    }, error => {
      this.toastService.danger('Sorry, something went wrong.');
    });
  }
}
