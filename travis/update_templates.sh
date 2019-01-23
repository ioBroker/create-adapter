#!/bin/bash

set -e

# Make sure the paths we reference are relative to this script
cd "${BASH_SOURCE%/*}" || exit

export OWN_VERSION=$(node -e "console.log(require('../package.json').version)")

# Clone the template repo
rm -rf ioBroker.template
git clone https://github.com/AlCalzone/ioBroker.template

# Create all templates
node --require ts-node/register create_templates.ts

# Commit the changes
cd ioBroker.template
git config --global user.email "d.griesel@gmx.net"
git config --global user.name "Al Calzone"
git remote rm origin
git remote add origin https://AlCalzone:${GITHUB_TOKEN}@github.com/AlCalzone/ioBroker.template.git
git add -A
git commit -m "Update templates to creator version v$OWN_VERSION" || NO_UPDATE=true
if [ "$NO_UPDATE" = "true" ]; then
	echo "Nothing to update"
	exit 0
fi
git push --set-upstream origin master

# Create PR in the ioBroker repo
cd ..
node --require ts-node/register create_pullrequest.ts
