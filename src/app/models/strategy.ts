export interface StrategyParametersRequestDto {
    clientId: string;
    exchangeName: string;
    strategyName: string;
    entryCurrencyCode: string;
    exitCurrencyCode: string;
    exitCurrencyFractionForBuying: number;
    maxExitCurrencyPercentForBuying: number;
    strategySpecificParameters: Map<string, number>;
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
    maxExitCurrencyPercentForBuying: number;
    exitCurrencyFractionForBuying: number;
    strategySpecificParameters: Map<string, number>;
}
export interface StrategyExecutionResponseDto {
    id: number;
    clientId: string;
    exchangeName: string;
    strategyName: string;
    entryCurrencyCode: string;
    exitCurrencyCode: string;
    strategyParameters: StrategyParametersResponseDto;
    orders: LocalOrderDto[];
}