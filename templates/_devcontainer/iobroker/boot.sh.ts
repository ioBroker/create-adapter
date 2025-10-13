import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) {
		return;
	}

	const template = `
#!/bin/bash

set -e

# Define log file location
LOG_FILE=/opt/iobroker/log/boot.log
mkdir -p /opt/iobroker/log

# Start logging to the file (standard output and error)
exec > >(tee "$LOG_FILE") 2>&1

/opt/scripts/iobroker_startup.sh
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/iobroker/boot.sh";
export = templateFunction;
