#!/bin/bash

set -e

# Make sure the paths we reference are relative to this script
cd "${BASH_SOURCE%/*}" || exit

# Create an empty folder for the templates
mkdir ioBroker.template
# clean it up on exit
trap 'rm -rf ioBroker.template' EXIT

# Test the template creation
node --require ts-node/register create_templates.ts
