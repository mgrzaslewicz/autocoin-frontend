// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import {defaultEnvironment} from './environment.default';

const authServiceUrl = 'http://localhost:9002';
const exchangeMediatorServiceUrl = 'http://localhost:9001';
const strategyExecutorServiceUrl = 'http://localhost:9021';
const arbitrageMonitorUrl = 'http://localhost:10021';
const balanceMonitorUrl = 'http://localhost:10022'

export const environment = {
    ...defaultEnvironment,
    production: false,
    authServiceUrl: authServiceUrl,
    exchangeUsersApiUrl: authServiceUrl,
    ordersEndpointUrl: exchangeMediatorServiceUrl,
    exchangeKeysCapabilityEndpointUrl: exchangeMediatorServiceUrl,
    pricesEndpointUrl: `${exchangeMediatorServiceUrl}/prices`,
    strategiesEndpointUrl: strategyExecutorServiceUrl,
    healthEndpointUrl: `${exchangeMediatorServiceUrl}/health`,
    arbitrageMonitorEndpointUrl: arbitrageMonitorUrl,
    balanceMonitorApiBaseUrl: balanceMonitorUrl
};
