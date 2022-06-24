import {defaultEnvironment} from './environment.default';

const authServiceUrl = 'https://users-apiv2.autocoin-trader.com';
const exchangeMediatorServiceUrl = 'https://orders-api.autocoin-trader.com';
const strategyExecutorServiceUrl = 'https://strategies-api.autocoin-trader.com';
const arbitrageMonitorHost = 'https://arbitrage-monitor.autocoin-trader.com';
const balanceMonitorHost = 'https://balance-monitor.autocoin-trader.com';

export const environment = {
    ...defaultEnvironment,
    production: true,
    oauthEndpointUrl: `${authServiceUrl}/oauth/token`,
    exchangeUsersApiUrl: authServiceUrl,
    twoFactorAuthenticationEndpointUrl: `${authServiceUrl}/user-accounts/2fa`,
    changePasswordEndpointUrl: `${authServiceUrl}/user-accounts/password`,
    requestEmailWithResetPasswordTokenEndpointUrl: `${authServiceUrl}/user-accounts/password/reset-with-token/step-1-send-email-with-token`,
    changePasswordWithResetPasswordTokenEndpointUrl: `${authServiceUrl}/user-accounts/password/reset-with-token/step-2-change-password`,
    ordersEndpointUrl: exchangeMediatorServiceUrl,
    exchangeKeysCapabilityEndpointUrl: exchangeMediatorServiceUrl,
    pricesEndpointUrl: `${exchangeMediatorServiceUrl}/prices`,
    strategiesEndpointUrl: strategyExecutorServiceUrl,
    healthEndpointUrl: `${exchangeMediatorServiceUrl}/health`,
    signupEndpointUrl: `${authServiceUrl}/user-accounts`,
    arbitrageMonitorEndpointUrl: arbitrageMonitorHost,
    balanceMonitorApiBaseUrl: balanceMonitorHost
};
