#!/bin/bash
set -e

# Build the Docker image
echo "Building Docker image..."
docker build -t culero-api .

# Run the Docker container with dummy environment variables
echo "Running Docker container..."
docker run --rm -d \
  -e DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
  -e JWT_SECRET="dummy_secret" \
  -e REDIS_URL="redis://localhost:6379" \
  --name culero-api-test \
  culero-api

# Wait for the container to start (adjust the sleep time as needed)
sleep 10

# Check if the container is running
if [ "$(docker inspect -f '{{.State.Running}}' culero-api-test)" = "true" ]; then
  echo "Docker container is running successfully."
else
  echo "Docker container failed to start."
  exit 1
fi

# Optional: You can add more tests here, such as checking if the API responds correctly

# Clean up
echo "Cleaning up..."
docker stop culero-api-test

echo "Docker build and run tests completed successfully."