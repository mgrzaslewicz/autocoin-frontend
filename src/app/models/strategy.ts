export interface StrategyParametersRequestDto {
    exchangeUserId: string;
    exchangeName: string;
    strategyName: string;
    baseCurrencyCode: string;
    counterCurrencyCode: string;
    counterCurrencyFractionForBuying: number;
    maxCounterCurrencyPercentForBuying: number;
    strategySpecificParameters: Map<string, number>;
}

export class StrategyParametersRequest implements StrategyParametersRequestDto {
    exchangeUserId: string;
    exchangeName: string;
    strategyName: string;
    baseCurrencyCode: string;
    counterCurrencyCode: string;
    baseCurrencyFractionForSelling: number;
    counterCurrencyFractionForBuying: number;
    maxBaseCurrencyPercentForSelling: number;
    maxCounterCurrencyPercentForBuying: number;
    strategySpecificParameters: Map<string, any> = new Map<string, any>();
}

export interface LocalOrderDto {
    exchangeName: string;
    exchangeOrderId: string;
    status: string;
    isBuy: boolean;
    price: number;
    amount: number;
    openTime: number;
    closeTime: number; // nullable
}

export interface StrategyParametersResponseDto {
    maxCounterCurrencyPercentForBuying: number;
    counterCurrencyFractionForBuying: number;
    strategySpecificParameters: Map<string, number>;
}

export enum StrategyExecutionStatus {
    Active = 'ACTIVE',
    Deleted = 'DELETED',
    Aborted = 'ABORTED',
    Finished = 'FINISHED'
}

export interface StrategyExecutionResponseDto {
    id: string;
    exchangeUserId: string;
    exchangeName: string;
    strategyName: string;
    baseCurrencyCode: string;
    counterCurrencyCode: string;
    strategyParameters: StrategyParametersResponseDto;
    orders: LocalOrderDto[];
    status: StrategyExecutionStatus;
}


export class Strategy {
    public name: string;
    public isSelling: boolean;
    public isBuying: boolean;
}
