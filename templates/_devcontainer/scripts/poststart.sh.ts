import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const template = `
#!/bin/bash

set -e

# execute poststart only if container was created right before
if [ -e /tmp/.postcreate_done ]; then
    rm  /tmp/.postcreate_done
else
    # Wait for ioBroker to become ready
    sh .devcontainer/scripts/wait_for_iobroker.sh
fi
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/scripts/poststart.sh";
export = templateFunction;
