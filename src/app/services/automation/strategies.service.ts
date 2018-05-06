import { Injectable } from '@angular/core';
import { Strategy } from '../../models/strategy';
import { Observable } from 'rxjs';

@Injectable()
export class StrategiesService {

  getStrategies() : Observable<Strategy[]> {
    let strategies = [];

    let buyLowerAndLowerStrategy = new Strategy;
    buyLowerAndLowerStrategy.name = 'BuyLowerAndLower';
    strategies.push(buyLowerAndLowerStrategy);

    return Observable.of(strategies);
  }

}
