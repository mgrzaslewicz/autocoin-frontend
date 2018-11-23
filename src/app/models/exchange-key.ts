export class UpdateExchangeKeyRequestDto {
    userName?: String;
    apiKey: String;
    secretKey: String;
}

export class ExchangeKeyExistenceResponseDto {
    public exchangeId: String;
    public exchangeUserId: String;
}
