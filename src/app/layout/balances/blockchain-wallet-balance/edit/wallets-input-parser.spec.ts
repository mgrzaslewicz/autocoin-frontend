import {WalletsInputParser} from "./wallets-input-parser";

describe('WalletsInputParser', () => {

    it('should create wallets request when 2 wallets', () => {
        // given
        const tested: WalletsInputParser = new WalletsInputParser();
        // when
        let addWalletsRequest = tested.linesToDto('ETH', '0x445c9d791b782a7b181194950e0c0ee8c14468f1,savings1\n0x445c9d791b782a7b181194950e0c0ee8c14468f2,savings2')
        // then
        expect(addWalletsRequest.length).toEqual(2);

        expect(addWalletsRequest[0].currency).toEqual('ETH');
        expect(addWalletsRequest[0].walletAddress).toEqual('0x445c9d791b782a7b181194950e0c0ee8c14468f1');
        expect(addWalletsRequest[0].description).toEqual('savings1');


        expect(addWalletsRequest[1].currency).toEqual('ETH');
        expect(addWalletsRequest[1].walletAddress).toEqual('0x445c9d791b782a7b181194950e0c0ee8c14468f2');
        expect(addWalletsRequest[1].description).toEqual('savings2');
    });


    it('should create wallets request when 1 wallet', () => {
        // given
        const tested: WalletsInputParser = new WalletsInputParser();
        // when
        let addWalletsRequest = tested.linesToDto('ETH', '0x445c9d791b782a7b181194950e0c0ee8c14468f1,savings1')
        // then
        expect(addWalletsRequest.length).toEqual(1);

        expect(addWalletsRequest[0].currency).toEqual('ETH');
        expect(addWalletsRequest[0].walletAddress).toEqual('0x445c9d791b782a7b181194950e0c0ee8c14468f1');
        expect(addWalletsRequest[0].description).toEqual('savings1');
    });

    it('should create wallets request when 1 wallet and empty line', () => {
        // given
        const tested: WalletsInputParser = new WalletsInputParser();
        // when
        let addWalletsRequest = tested.linesToDto('ETH', '0x445c9d791b782a7b181194950e0c0ee8c14468f1,savings1\n')
        // then
        expect(addWalletsRequest.length).toEqual(1);

        expect(addWalletsRequest[0].currency).toEqual('ETH');
        expect(addWalletsRequest[0].walletAddress).toEqual('0x445c9d791b782a7b181194950e0c0ee8c14468f1');
        expect(addWalletsRequest[0].description).toEqual('savings1');
    });

    it('should create wallets request when additional spaces', () => {
        // given
        const tested: WalletsInputParser = new WalletsInputParser();
        // when
        let addWalletsRequest = tested.linesToDto('ETH', ' 0x445c9d791b782a7b181194950e0c0ee8c14468f1    , savings1  \n')
        // then
        expect(addWalletsRequest.length).toEqual(1);

        expect(addWalletsRequest[0].currency).toEqual('ETH');
        expect(addWalletsRequest[0].walletAddress).toEqual('0x445c9d791b782a7b181194950e0c0ee8c14468f1');
        expect(addWalletsRequest[0].description).toEqual('savings1');
    });

    it('should create no wallets when input undefined', () => {
        // given
        const tested: WalletsInputParser = new WalletsInputParser();
        // when
        let addWalletsRequest = tested.linesToDto('ETH', undefined);
        // then
        expect(addWalletsRequest.length).toEqual(0);
    });
});
