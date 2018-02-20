### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:8-alpine as builder

COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force &&\
    npm install && mkdir /autocoin-trader-front && cp -R ./node_modules /autocoin-trader-front

COPY . /autocoin-trader-front

WORKDIR /autocoin-trader-front

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build


### STAGE 2: Setup ###

FROM nginx:1.13.8-alpine

## Copy our default nginx config
COPY docker/nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /autocoin-trader-front/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
