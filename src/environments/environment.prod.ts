import {defaultEnvironment} from './environment.default';

const authServiceUrl = 'https://users-apiv2.autocoin-trader.com';
const exchangeMediatorUrl = 'https://orders-api.autocoin-trader.com';
const strategyExecutorServiceUrl = 'https://strategies-api.autocoin-trader.com';
const arbitrageMonitorUrl = 'https://arbitrage-monitor.autocoin-trader.com';
const balanceMonitorUrl = 'https://balance-monitor.autocoin-trader.com';

async function fetchConfig() {
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
    authServiceUrl: authServiceUrl,
    exchangeMediatorUrl: exchangeMediatorUrl,
    strategiesEndpointUrl: strategyExecutorServiceUrl,
    arbitrageMonitorEndpointUrl: arbitrageMonitorUrl,
    balanceMonitorApiBaseUrl: balanceMonitorUrl,
    ...fetchConfig(),
};
