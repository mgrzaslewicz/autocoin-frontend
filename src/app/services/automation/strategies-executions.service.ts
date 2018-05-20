import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StrategyExecutionResponseDto, StrategyParametersRequestDto } from '../../models/strategy';
import { ApiService } from '../api/api.service';
import * as _ from 'underscore';

@Injectable()
export class StrategiesExecutionsService {

  private strategiesApiUrl = 'https://strategies-api.autocoin-trader.com';
  private getStrategiesUrl = `${this.strategiesApiUrl}/strategies`;
  private strategyUrl = `${this.strategiesApiUrl}/strategy`;

  constructor(private api: ApiService) { }

  public getStrategiesExecutions(): Observable<StrategyExecutionResponseDto[]> {
    return this.api.get(this.getStrategiesUrl);
  }

  public createStrategyExecution(parameters: StrategyParametersRequestDto): Observable<StrategyExecutionResponseDto> {
    return this.api.post(this.strategyUrl, parameters);
  }

  public deleteStrategyExecution(strategyExecutionId: string) {
    return this.api.delete(`${this.strategyUrl}/${strategyExecutionId}`);
  }

}
