// TODO replace with ExchangeKeyExistence without keys
export class ExchangeKey {
    public exchangeId: String;
    public clientId: String;
    public apiKey: String;
    public secretKey: String;
    public keyIsFilled: Boolean;
}

export class ExchangeKeyExistence {
    public exchangeId: String;
    public exchangeUserId: String;
}
