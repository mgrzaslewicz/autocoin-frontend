import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StrategyExecutionResponseDto, StrategyParametersRequestDto } from '../../models/strategy';
import { ApiService } from '../api/api.service';
import * as _ from 'underscore';

@Injectable()
export class StrategiesExecutionsService {

  private stragetiesApiUrl = 'https://strategies-api.autocoin-trader.com';
  private getStrategiesUrl = `${this.stragetiesApiUrl}/strategies`;
  private stragetyUrl = `${this.stragetiesApiUrl}/strategy`;

  constructor(private api: ApiService) { }

  public getStrategiesExecutions(): Observable<StrategyExecutionResponseDto[]> {
    return this.api.get(this.getStrategiesUrl);
  }

  public postStrategyExecution(parameters: StrategyParametersRequestDto) {
    let postParameters = _.clone<any>(parameters);

    postParameters.strategySpecificParameters = {};
    for (let [k, v] of Array.from(parameters.strategySpecificParameters)) {
      postParameters.strategySpecificParameters[k] = v;
    }

    return this.api.post(this.stragetyUrl, postParameters);
  }

  public deleteStrategyExecution(strategyExecutionId: string) {
    return this.api.delete(`${this.stragetyUrl}/${strategyExecutionId}`);
  }

}
