import {defaultEnvironment} from './environment.default';

const authServiceUrl = 'https://users-apiv2.autocoin-trader.com';
const exchangeMediatorServiceUrl = 'https://orders-api.autocoin-trader.com';
const strategyExecutorServiceUrl = 'https://strategies-api.autocoin-trader.com';

export const environment = {
    ...defaultEnvironment,
    production: true,
    oauthEndpointUrl: `${authServiceUrl}/oauth/token`,
    exchangeUsersApiUrl: authServiceUrl,
    twoFactorAuthenticationEndpointUrl: `${authServiceUrl}/user-accounts/2fa`,
    changePasswordEndpointUrl: `${authServiceUrl}/user-accounts/password`,
    exchangeWalletEndpointUrl: exchangeMediatorServiceUrl,
    ordersEndpointUrl: exchangeMediatorServiceUrl,
    pricesEndpointUrl: `${exchangeMediatorServiceUrl}/prices`,
    strategiesEndpointUrl: strategyExecutorServiceUrl,
};
