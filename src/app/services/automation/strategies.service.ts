import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { StrategyExecutionResponseDto } from '../../models/strategy';
import { ApiService } from '../api/api.service';

@Injectable()
export class StrategiesService {

  private stragetiesApiUrl = 'https://strategies-api.autocoin-trader.com';
  private getStrategiesUrl = `${this.stragetiesApiUrl}/strategies`;
  private postStragetyUrl = `${this.stragetiesApiUrl}/strategy`;

  constructor(private api: ApiService) { }

  getStrategies(): Observable<StrategyExecutionResponseDto[]> {
    return this.api.get(this.getStrategiesUrl);
  }

}
