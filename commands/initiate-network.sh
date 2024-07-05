#!/bin/bash

# Stop the old network
./test-network/network.sh down

# Start a new network and create a new channel
./test-network/network.sh up createChannel -s couchdb

# Start the packet chaincode
./test-network/network.sh deployCC -ccn log -ccp ../chaincode/ -ccl typescript




