import { Component, OnInit } from '@angular/core';
import { StrategiesExecutionsService } from '../../services/automation/strategies-executions.service';
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

  exchanges: Exchange[];

  private strategiesExecutions: StrategyExecutionResponseDto[];

  constructor(
    private toastService: ToastService,
    private exchangesService: ExchangesService,
    private strategiesExecutionsService: StrategiesExecutionsService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    Observable.forkJoin(
      this.exchangesService.getExchanges(),
      this.strategiesExecutionsService.getStrategiesExecutions()
    ).subscribe(([exchanges, strategiesExecutions]) => {
      this.exchanges = exchanges;
      this.strategiesExecutions = strategiesExecutions;
      console.log(this.strategiesExecutions);
    }, error => {
      this.toastService.danger('Sorry, something went wrong.');
    });
  }

  getStrategiesExecutionsByExchangeName(exchangeName) {
    return this.strategiesExecutions.filter(strategyExecution => {
      return strategyExecution.exchangeName == exchangeName;
    });
  }

  deleteStrategyExecution(strategyExecution) {
    this.strategiesExecutionsService.deleteStrategyExecution(strategyExecution.id).subscribe(() => {
      this.loadData();
    });
  }
}
