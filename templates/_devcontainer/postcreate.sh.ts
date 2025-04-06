import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const adapterNameLowerCase = answers.adapterName.toLowerCase();

	const template = `
#!/bin/bash

set -e

# delete discovery adapter
iob del discovery

# disable error reporting
iob plugin disable sentry

# set the license as confirmed
iob object set system.config common.licenseConfirmed=true

# package the adapter
NPM_PACK=$(npm pack)

# install the adapter
iob url \"$(pwd)/$NPM_PACK\" --debug

# create a new adapter instance
iob add ${adapterNameLowerCase}

# stop the newly created instance
iob stop ${adapterNameLowerCase}

# delete the adapter package
rm \"$NPM_PACK\"

# execute custom postcreate script if existing
if [ -e .devcontainer/postcreate_ext.sh ]; then
    sh .devcontainer/postcreate_ext.sh
fi
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/postcreate.sh";
export = templateFunction;
