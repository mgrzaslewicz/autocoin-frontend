// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import {defaultEnvironment} from './environment.default';

const authServiceHost = 'http://localhost:9002';
const exchangeMediatorServiceUrl = 'http://localhost:9001';
const strategyExecutorServiceUrl = 'http://localhost:9021';
const arbitrageMonitorHost = 'http://localhost:10021';
const balanceMonitorHost = 'http://localhost:10022'

export const environment = {
    ...defaultEnvironment,
    production: false,
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
