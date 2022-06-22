export interface UpdateExchangeKeyRequestDto {
    userName?: String;
    apiKey: String;
    secretKey: String;
    exchangeSpecificKeyParameters?: Map<string, string>;
}

export interface ExchangeKeyExistenceResponseDto {
    exchangeId: string;
    exchangeUserId: string;
}

export interface ExchangeKeyCapabilityResponseDto {
    exchangeId: string;
    exchangeUserId: string;
    canReadWallet: boolean;
}
