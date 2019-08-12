export interface StrategyBuyParametersDto {
    counterCurrencyPercentLimitForBuying: number;
    counterCurrencyAmountLimitForBuying: number;
    counterCurrencyPercentForBuyingPerOrder: number;
}

export interface StrategySellParametersDto {
    baseCurrencyPercentLimitForSelling: number;
    baseCurrencyAmountLimitForSelling: number;
    baseCurrencyPercentForSellingPerOrder: number;
}

export interface StrategyParametersRequestDto {
    exchangeUserId: string;
    exchangeName: string;
    strategyName: string;
    baseCurrencyCode: string;
    counterCurrencyCode: string;
    buyParameters?: StrategyBuyParametersDto;
    sellParameters?: StrategySellParametersDto;
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
    baseCurrencyPercentForSellingPerOrder?: number;
    baseCurrencyPercentLimitForSelling?: number;
    baseCurrencyAmountLimitForSelling?: number;

    counterCurrencyPercentLimitForBuying?: number;
    counterCurrencyAmountLimitForBuying?: number;
    counterCurrencyPercentForBuyingPerOrder?: number;

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
    startTime: number;
    baseCurrencyAmountLimitForSelling: number;
    baseCurrencySpent: number;
    counterCurrencyAmountLimitForBuying: number;
    counterCurrencySpent: number;
    description: string;
    percentDone: number;

}


export interface Strategy {
    name: string;
    isSelling: boolean;
    isBuying: boolean;
}
