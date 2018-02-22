#!/bin/bash

buildFrontend() {
    echo "Pulling repository"
    cd /var/www/autocoin-trader-frontend
    git pull origin master

    echo "Building docker container"
    docker build . -t autocoin-trader-frontend
}

removeOldContainer() {
    echo "Removing old containers"
    docker stop $(docker ps -a -q  --filter ancestor=autocoin-trader-frontend)
    docker rm $(docker ps -a -q  --filter ancestor=autocoin-trader-frontend)
}

startContainer() {
    echo "Starting container"
    docker run -d -p 127.0.0.1:4280:80 --restart=always autocoin-trader-frontend
}

buildFrontend && removeOldContainer && startContainer
