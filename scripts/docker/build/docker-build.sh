#!/bin/bash

function getVersion() {
  gitCommit=$(git rev-parse --short HEAD)
  packageJsonVersion=$(cat package.json | grep version | sed "s/\"version\": \"//g" | sed "s/\",//g")
  version="${packageJsonVersion}-${gitCommit}"
  echo "${version}"
}

function buildDocker() {
  SERVICE_NAME="autocoin-trader-frontend"
  VERSIONED_IMAGE="$SERVICE_NAME:$1"
  echo "Building docker image $VERSIONED_IMAGE..."
  docker build . -t $SERVICE_NAME -t "$VERSIONED_IMAGE"
}

buildDocker $(getVersion)
