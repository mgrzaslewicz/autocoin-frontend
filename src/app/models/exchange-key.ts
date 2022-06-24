export interface UpdateExchangeKeyRequestDto {
    userName?: String;
    apiKey: String;
    secretKey: String;
    exchangeSpecificKeyParameters?: Map<string, string>;
}

export interface ExchangeKeyExistenceResponseDto {
    exchangeId: string;
    exchangeName: string;

    exchangeUserId: string;
    exchangeUserName: string;
}

export interface ExchangeKeyCapabilityResponseDto {
    exchangeId: string;
    exchangeUserId: string;
    canReadWallet: boolean;
}
