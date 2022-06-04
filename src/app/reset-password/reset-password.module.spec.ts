import { ResetPasswordModule } from './login.module';

describe('LoginModule', () => {
    let loginModule: ResetPasswordModule;

    beforeEach(() => {
        loginModule = new ResetPasswordModule();
    });

    it('should create an instance', () => {
        expect(loginModule).toBeTruthy();
    });
});
