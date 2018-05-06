import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StrategyExecutionResponseDto, StrategyParametersRequestDto } from '../../models/strategy';
import { ApiService } from '../api/api.service';

@Injectable()
export class StrategiesExecutionsService {

  private stragetiesApiUrl = 'https://strategies-api.autocoin-trader.com';
  private getStrategiesUrl = `${this.stragetiesApiUrl}/strategies`;
  private postStragetyUrl = `${this.stragetiesApiUrl}/strategy`;

  constructor(private api: ApiService) { }

  public getStrategiesExecutions(): Observable<StrategyExecutionResponseDto[]> {
    return this.api.get(this.getStrategiesUrl);
  }

  public postStrategyExecution(parameters: StrategyParametersRequestDto) {
    return this.api.post(this.postStragetyUrl, parameters);
  }

}
