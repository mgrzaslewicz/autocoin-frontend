import { ExchangeHealthTileModule } from './exchange-health-tile.module';

describe('HealthPanelModule', () => {
    let healthPanelModule: ExchangeHealthTileModule;

    beforeEach(() => {
        healthPanelModule = new ExchangeHealthTileModule();
    });

    it('should create an instance', () => {
        expect(healthPanelModule).toBeTruthy();
    });
});
