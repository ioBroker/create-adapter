import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const template = `
FROM iobroker/iobroker:latest
RUN ln -s /opt/iobroker/node_modules/ /root/.node_modules
	&& apt-get -y --no-install-recommends install openssh-client \\
	&& apt-get clean && rm -rf /var/lib/apt/lists/*
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/iobroker/Dockerfile";
export = templateFunction;
