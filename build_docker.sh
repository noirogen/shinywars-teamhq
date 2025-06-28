#!/bin/bash

DOCKER_TAG=${1:-shinywars-teamhq-web}
DOCKER_DEFAULT_PLATFORM=${2:-linux/amd64}

echo "--- Building Docker image ---"
echo "Image Name: '$DOCKER_TAG'"
echo "Platform: '$DOCKER_DEFAULT_PLATFORM'"
echo "---------------------------"

docker build --platform "$DOCKER_DEFAULT_PLATFORM" -t "$DOCKER_TAG" .