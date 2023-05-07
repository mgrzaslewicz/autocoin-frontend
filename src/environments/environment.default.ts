import * as localhostConfig from '../config/config.localhost.json';

interface JsonModule {
    default: any;
}

const jsonLocalhostConfig = localhostConfig as unknown as JsonModule;

export const defaultEnvironment = {
    ...jsonLocalhostConfig.default,
};
