#!/usr/bin/env bash
set -x # turn on debug mode
set -e # exit on any error

VERSION="${VERSION:=latest}"
SERVICE_NAME="autocoin-trader-frontend"
PROPERTY_FILE="${PROPERTY_FILE:=env.properties}"
CONFIG="${CONFIG:=default}"

loadEnv() {
  if [[ -f "$PROPERTY_FILE" ]]; then
    echo "Loading variables from $PROPERTY_FILE"
    . "$PROPERTY_FILE"
  else
    echo "No $PROPERTY_FILE present, not variables will be overriden"
  fi
}

loadEnv

# Run new container
echo "Starting container 'autocoin-trader-frontend:$VERSION'"

docker run \
  --name "autocoin-trader-frontend" \
  -d \
  -p 127.0.0.1:4280:80 \
  -e CONFIG="${CONFIG}" \
  --memory=100m \
  --restart=no \
  "autocoin-trader-frontend:$VERSION"
