### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:12.22.12-alpine as builder

COPY package.json package-lock.json ./

#RUN apk add --no-cache python2

RUN npm set progress=false && \
    npm config set depth 0 && \
    npm install && \
    mkdir /autocoin-trader-frontend && \
    cp -R ./node_modules /autocoin-trader-frontend

COPY . /autocoin-trader-frontend

WORKDIR /autocoin-trader-frontend

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build


### STAGE 2: Setup ###

FROM nginx:1.23.0-alpine

## Copy our default nginx config
COPY docker/nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /autocoin-trader-frontend/dist /usr/share/nginx/html
COPY landing-page/ /usr/share/nginx/html/landing-page

# Copy all available app config files so that they can be used by parametrized entrypoint script
RUN mkdir /config
ADD src/config/*.json /config/

RUN mkdir -p /scripts/run
ADD docker/copy-run-scripts.sh /scripts/
ADD scripts/docker/run/*.sh /scripts/run/
RUN chmod -R +x /scripts/copy-run-scripts.sh

RUN mkdir -p /app/run

ADD docker/docker-entrypoint.sh /usr/local/bin/

CMD ["docker-entrypoint.sh"]
