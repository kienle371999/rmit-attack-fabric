#!/bin/bash

cd explorer

# Stop the explorer and remove unused volumes
docker-compose down
docker volume rm explorer_pgdata explorer_walletstore --force

# Start a new explorer
docker-compose up