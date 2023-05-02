#!/bin/bash

ALREADY_RUNNING_CONTAINER="$(docker ps -a -q  --filter ancestor=autocoin-trader-frontend)"

buildDockerImage() {
    echo "Building docker container..."
    docker build . -t autocoin-trader-frontend
}

removeOldContainer() {
    if [ -z "$ALREADY_RUNNING_CONTAINER" ]
    then
        echo "No previous containers running found"
    else
        echo "Removing old containers"
        docker stop "${ALREADY_RUNNING_CONTAINER}"
        docker rm "${ALREADY_RUNNING_CONTAINER}"
    fi
}

startContainer() {
    echo "Starting container"
    docker run -d -p 127.0.0.1:4280:80 --restart=always autocoin-trader-frontend
}

buildDockerImage && removeOldContainer && startContainer
