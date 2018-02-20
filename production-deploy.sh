#!/bin/bash

echo "Removing old containers"
sudo docker stop $(sudo docker ps -a -q  --filter ancestor=autocoin-trader-frontend)
sudo docker rm $(sudo docker ps -a -q  --filter ancestor=autocoin-trader-frontend)

echo "Pulling repository"
cd /var/www/autocoin-trader-frontend
git pull origin master

echo "Building docker container"
sudo docker build . -t autocoin-trader-frontend

echo "Starting container"
sudo docker run -d -p 127.0.0.1:4280:80 --restart=always autocoin-trader-frontend