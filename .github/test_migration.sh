#!/bin/bash

set -e

# Make sure the paths we reference are relative to this script
cd "${BASH_SOURCE%/*}" || exit

# Run the TypeScript migration test
node --require tsx/cjs test_migration.ts
