import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StrategyExecutionResponseDto, StrategyParametersRequestDto} from '../../models/strategy';
import {HttpClient} from '@angular/common/http';
import {WithMessageDto} from '../api/withMessageDto';
import {StrategiesEndpointUrlToken} from '../../../environments/endpoint-tokens';

@Injectable()
export class StrategiesExecutionsService {

    private getStrategiesUrl = `${this.strategiesEndpointUrl}/strategies`;
    private strategyUrl = `${this.strategiesEndpointUrl}/strategy`;

    constructor(
        @Inject(StrategiesEndpointUrlToken) private strategiesEndpointUrl: string,
        private http: HttpClient
    ) {
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
