import {Injectable} from '@angular/core';
import {Strategy} from '../../models/strategy';
import {Observable} from 'rxjs';

@Injectable()
export class StrategiesService {

    getStrategies(): Observable<Strategy[]> {
        const strategies = [];

        const buyLowerAndLowerStrategy = new Strategy;
        buyLowerAndLowerStrategy.name = 'BuyLowerAndLower';
        strategies.push(buyLowerAndLowerStrategy);

        const sellHigherAndHigherStrategy = new Strategy;
        sellHigherAndHigherStrategy.name = 'SellHigherAndHigher';
        strategies.push(sellHigherAndHigherStrategy);

        return Observable.of(strategies);
    }

}
