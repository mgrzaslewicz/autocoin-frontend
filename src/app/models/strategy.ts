export interface StrategyParametersRequestDto {
    clientId: string;
    exchangeName: string;
    strategyName: string;
    baseCurrencyCode: string;
    counterCurrencyCode: string;
    counterCurrencyFractionForBuying: number;
    maxCounterCurrencyPercentForBuying: number;
    strategySpecificParameters: Map<string, number>;
}

export class StrategyParametersRequest implements StrategyParametersRequestDto {
    clientId: string;
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
export interface StrategyExecutionResponseDto {
    id: number;
    clientId: string;
    exchangeName: string;
    strategyName: string;
    baseCurrencyCode: string;
    counterCurrencyCode: string;
    strategyParameters: StrategyParametersResponseDto;
    orders: LocalOrderDto[];
}

export class Strategy {
    public name: string;
}
