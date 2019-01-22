#!/bin/bash

# Try to execute the creator -> start npx, wait 60s and check the exit code
timeout 30 npx .

# It should be 124 (timeout has passed)
if [[ $? -eq 124 ]]; then
	exit 0
else
	exit 1
fi
