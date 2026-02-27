#!/bin/bash
set -euxo pipefail

docker load -i /tmp/docker-image.tar

echo "Building docker image..."
docker compose build

echo "Starting docker compose..."
docker compose up -d

echo "Checking docker compose status..."
docker compose ps

echo "Waiting for health services..."
npm run wait-4-docker

echo "Migrating DB..."
docker compose run \
  -e ALS_MSISDN_ORACLE_DATABASE_HOST='mysql' \
  -e ALS_MSISDN_ORACLE_DATABASE_PORT='3306' \
  --rm als-msisdn-oracle-svc \
  npm run migrate

echo "Running integration tests..."
npm ci
NODE_ENV=integration npm -s run test:int

echo "Stopping docker compose..."
docker compose down -v

echo "Integration tests complete. Results in ./test/results"
