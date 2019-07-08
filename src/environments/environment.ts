// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import {defaultEnvironment} from './environment.default';

const authServiceUrl = 'http://localhost:9002';
const exchangeMediatorServiceUrl = 'http://localhost:9001';
const strategyExecutorServiceUrl = 'https://strategies-api.autocoin-trader.com';

export const environment = {
    ...defaultEnvironment,
    production: false,
    oauthEndpointUrl: `${authServiceUrl}/oauth/token`,
    exchangeUsersApiUrl: authServiceUrl,
    twoFactorAuthenticationEndpointUrl: `${authServiceUrl}/user-accounts/2fa`,
    changePasswordEndpointUrl: `${authServiceUrl}/user-accounts/password`,
    exchangeWalletEndpointUrl: exchangeMediatorServiceUrl,
    ordersEndpointUrl: exchangeMediatorServiceUrl,
    pricesEndpointUrl: `${exchangeMediatorServiceUrl}/prices`,
    strategiesEndpointUrl: strategyExecutorServiceUrl
};
