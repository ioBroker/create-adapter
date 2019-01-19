#!/bin/bash

# Try to execute the creator -> start npx, wait 90s and check the exit code
timeout 90 npx .

# It should be 124 (timeout has passed)
if [[ $? -eq 124 ]]; then
	exit 0
else
	exit 1
fi
