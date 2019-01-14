import { HealthPanelModule } from './health-panel.module';

describe('HealthPanelModule', () => {
    let healthPanelModule: HealthPanelModule;

    beforeEach(() => {
        healthPanelModule = new HealthPanelModule();
    });

    it('should create an instance', () => {
        expect(healthPanelModule).toBeTruthy();
    });
});
