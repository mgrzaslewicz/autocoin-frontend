import {CurrencyAssetsInputParser} from "./currency-assets-input-parser.service";

describe('CurrencyAssetsInputParser', () => {

    const tested: CurrencyAssetsInputParser = new CurrencyAssetsInputParser();

    it('should create add currency assets request when 2 wallets', () => {
        // given
        // when
        let requestDtos = tested.linesToDtos('LTC,5600,kept at binance\nXRP,1.23656,at hard wallet')
        // then
        expect(requestDtos.length).toEqual(2);

        expect(requestDtos[0].currency).toEqual('LTC');
        expect(requestDtos[0].description).toEqual('kept at binance');
        expect(requestDtos[0].balance).toEqual('5600');

        expect(requestDtos[1].currency).toEqual('XRP');
        expect(requestDtos[1].description).toEqual('at hard wallet');
        expect(requestDtos[1].balance).toEqual('1.23656');
    });


    it('should create add currency assets request when 1 currency', () => {
        // when
        let requestDtos = tested.linesToDtos('LTC,456.1,savings1')
        // then
        expect(requestDtos.length).toEqual(1);

        expect(requestDtos[0].currency).toEqual('LTC');
        expect(requestDtos[0].description).toEqual('savings1');
        expect(requestDtos[0].balance).toEqual('456.1');
    });

    it('should create add currency assets request when 1 wallet and empty line', () => {
        // when
        let requestDtos = tested.linesToDtos('LTC,5600,kept at binance\n')
        // then
        expect(requestDtos.length).toEqual(1);

        expect(requestDtos[0].currency).toEqual('LTC');
        expect(requestDtos[0].description).toEqual('kept at binance');
        expect(requestDtos[0].balance).toEqual('5600');
    });

    it('should create add currency assets request when additional spaces', () => {
        // when
        let requestDtos = tested.linesToDtos('LTC,   5600,  kept at binance\n')
        // then
        expect(requestDtos.length).toEqual(1);

        expect(requestDtos[0].currency).toEqual('LTC');
        expect(requestDtos[0].description).toEqual('kept at binance');
        expect(requestDtos[0].balance).toEqual('5600');
    });

    it('should create no currency assets request dtos when input undefined', () => {
        // when
        let requestDtos = tested.linesToDtos(undefined);
        // then
        expect(requestDtos.length).toEqual(0);
    });

    it('should create no currency assets request dtos when no balance', () => {
        // when
        let requestDtos = tested.linesToDtos('BNB,at binance');
        // then
        expect(requestDtos.length).toEqual(0);
    });
});
