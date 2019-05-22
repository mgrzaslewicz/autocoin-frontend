export class UpdateExchangeKeyRequestDto {
    userName?: String;
    apiKey: String;
    secretKey: String;
    exchangeSpecificKeyParameters: any;
}

export class ExchangeKeyExistenceResponseDto {
    constructor(
        public exchangeId: string,
        public exchangeUserId: string) {
    }
}

export class ExchangeKeyCapabilityResponseDto {
    constructor(
        public exchangeId: string,
        public exchangeUserId: string,
        public canReadWallet: boolean) {
    }
}
