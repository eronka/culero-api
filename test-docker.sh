#!/bin/bash
set -e

echo "Building Docker image..."
docker build -t culero-api .

echo "Running Docker container..."
docker run --rm -d \
  -e DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
  -e JWT_SECRET="dummy_secret" \
  -e REDIS_URL="redis://localhost:6379" \
  --name culero-api-test \
  culero-api

sleep 10

if [ "$(docker inspect -f '{{.State.Running}}' culero-api-test)" = "true" ]; then
  echo "Docker container is running successfully."
else
  echo "Docker container failed to start."
  exit 1
fi


echo "Cleaning up..."
docker stop culero-api-test

echo "Docker build and run tests completed successfully."