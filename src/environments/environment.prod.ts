import {defaultEnvironment} from './environment.default';

const authServiceHost = 'https://users-apiv2.autocoin-trader.com';
const exchangeMediatorServiceUrl = 'https://orders-api.autocoin-trader.com';
const strategyExecutorServiceUrl = 'https://strategies-api.autocoin-trader.com';
const arbitrageMonitorHost = 'https://arbitrage-monitor.autocoin-trader.com';
const balanceMonitorHost = 'https://balance-monitor.autocoin-trader.com';

export const environment = {
    ...defaultEnvironment,
    production: true,
    oauthEndpointUrl: `${authServiceHost}/oauth/token`,
    exchangeUsersApiUrl: authServiceHost,
    twoFactorAuthenticationEndpointUrl: `${authServiceHost}/user-accounts/2fa`,
    changePasswordEndpointUrl: `${authServiceHost}/user-accounts/password`,
    requestEmailWithResetPasswordTokenEndpointUrl: `${authServiceHost}/user-accounts/password/reset-with-token/step-1-send-email-with-token`,
    authServiceEndpointUrl: authServiceHost,
    changePasswordWithResetPasswordTokenEndpointUrl: `${authServiceHost}/user-accounts/password/reset-with-token/step-2-change-password`,
    ordersEndpointUrl: exchangeMediatorServiceUrl,
    exchangeKeysCapabilityEndpointUrl: exchangeMediatorServiceUrl,
    pricesEndpointUrl: `${exchangeMediatorServiceUrl}/prices`,
    strategiesEndpointUrl: strategyExecutorServiceUrl,
    healthEndpointUrl: `${exchangeMediatorServiceUrl}/health`,
    signupEndpointUrl: `${authServiceHost}/user-accounts`,
    arbitrageMonitorEndpointUrl: arbitrageMonitorHost,
    balanceMonitorApiBaseUrl: balanceMonitorHost
};
