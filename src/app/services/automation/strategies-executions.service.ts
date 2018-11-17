import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StrategyExecutionResponseDto, StrategyParametersRequestDto} from '../../models/strategy';
import {HttpClient} from '@angular/common/http';
import {WithMessageDto} from '../api/withMessageDto';

@Injectable()
export class StrategiesExecutionsService {

    private strategiesApiUrl = 'https://strategies-api.autocoin-trader.com';
    private getStrategiesUrl = `${this.strategiesApiUrl}/strategies`;
    private strategyUrl = `${this.strategiesApiUrl}/strategy`;

    constructor(private http: HttpClient) {
    }

    public getStrategiesExecutions(): Observable<StrategyExecutionResponseDto[]> {
        return this.http.get<StrategyExecutionResponseDto[]>(this.getStrategiesUrl);
    }

    public createStrategyExecution(parameters: StrategyParametersRequestDto): Observable<WithMessageDto<StrategyExecutionResponseDto>> {
        return this.http.post(this.strategyUrl, parameters);
    }

    public deleteStrategyExecution(strategyExecutionId: string) {
        return this.http.delete(`${this.strategyUrl}/${strategyExecutionId}`);
    }

}
