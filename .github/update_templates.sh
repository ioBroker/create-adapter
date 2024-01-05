#!/bin/bash

set -e

# Make sure the paths we reference are relative to this script
cd "${BASH_SOURCE%/*}" || exit

export OWN_VERSION=$(node -e "console.log(require('../package.json').version)")

# Clone the template repo
rm -rf ioBroker.template
git clone https://github.com/ioBroker/ioBroker.template

# Create all templates
node --require tsx/cjs create_templates.ts

# Commit the changes
cd ioBroker.template
git config --global user.email "d.griesel@gmx.net"
git config --global user.name "Al Calzone"
git remote rm origin
git remote add origin https://AlCalzone:${GITHUB_TOKEN}@github.com/AlCalzone/ioBroker.template.git
# Create a new branch for these changes, so the PR creation succeeds later
export BRANCH_NAME="update-templates-to-$OWN_VERSION"
git checkout -b $BRANCH_NAME
git add -A
git commit -m "Update templates to creator version v$OWN_VERSION" || NO_UPDATE=true
if [ "$NO_UPDATE" = "true" ]; then
	echo "Nothing to update"
	exit 0
fi
git push -u origin $BRANCH_NAME

# Create PR in the ioBroker repo
cd ..
node --require tsx/cjs create_pullrequest.ts
