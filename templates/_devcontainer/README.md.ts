import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const template = `
# Devcontainer readme
This directory allows you to develop your adapter in a dedicated Docker container. To get started and for requirements, please read the getting started section at https://code.visualstudio.com/docs/remote/containers#_getting-started

Once you're done with that, VSCode will prompt you to reopen the adapter directory in a container. This takes a while, afterwards you can access the admin UI at http://localhost:8082. To change that port, edit \`docker-compose.yml\` to have a different \`ports\` configuration for \`nginx\`.
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/README.md";
export = templateFunction;
