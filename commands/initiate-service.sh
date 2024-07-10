#!/bin/bash

sudo snort -q -y -i ens160 -c /etc/snort/snort.conf &
cd app && npm run service