import {defaultEnvironment} from './environment.default';

const authServiceHost = 'https://users-apiv2.autocoin-trader.com';
const exchangeMediatorServiceUrl = 'https://orders-api.autocoin-trader.com';
const strategyExecutorServiceUrl = 'https://strategies-api.autocoin-trader.com';
const arbitrageMonitorHost = 'https://arbitrage-monitor.autocoin-trader.com';
const balanceMonitorHost = 'https://balance-monitor.autocoin-trader.com';

async function fetchConfig() {
    // const response = await fetch('/assets/configs/config.json');
    // return await response.json();
    // .then((response) => {
    //     if (response.ok) {
    //         return response.json();
    //     }
    //     throw new Error('config.json not Found');
    // })
    // .catch((err) => console.log('error', err))
    // use XMLHttpRequest instead of fetch
    const request = new XMLHttpRequest();
    request.open('GET', '/assets/config.json', false);
    request.send(null);
    if (request.status === 200) {
        try {
            return JSON.parse(request.responseText);
        } catch (e) {
            console.log('Error parsing config.json');
            return {};
        }
    } else {
        console.log('Fetching config.json failed.  Response status: ' + request.status);
        return {};
    }
}

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
    balanceMonitorApiBaseUrl: balanceMonitorHost,
    ...fetchConfig(),
};
