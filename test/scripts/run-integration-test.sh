#!/bin/bash
# Run integration tests similar to CircleCI job 'test-integration'
set -e

DOCKER_IMAGE="mojaloop/als-msisdn-oracle-svc:local"

echo "Creating test/results directory..."
mkdir -p ./test/results

echo "Building docker image..."
docker compose build

echo "Starting docker compose..."
docker compose up -d

echo "Checking docker compose status..."
docker compose ps

echo "Waiting for health services..."
npm run wait-4-docker

echo "Migrating DB..."
docker run --network mojaloop-net \
  -e ALS_MSISDN_ORACLE_DATABASE_HOST='mysql' \
  -e ALS_MSISDN_ORACLE_DATABASE_PORT='3306' \
  --rm $DOCKER_IMAGE \
  npm run migrate

echo "Running integration tests..."
npm ci
NODE_ENV=integration npm -s run test:integration

# Move junit.xml to test/results if exists
if [ -f junit.xml ]; then
  mv junit.xml test/results/
fi

echo "Stopping docker compose..."
docker compose down -v

echo "Integration tests complete. Results in ./test/results"
