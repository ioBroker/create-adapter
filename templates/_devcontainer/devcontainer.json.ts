import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const adapterNameLowerCase = answers.adapterName.toLowerCase();
	const useESLint = !!answers.tools?.includes("ESLint");
	const usePrettier = !!answers.tools?.includes("Prettier");

	const extensions: string[] = [];
	if (useESLint) extensions.push("dbaeumer.vscode-eslint");
	if (usePrettier) extensions.push("esbenp.prettier-vscode");

	const template = `
// For format details, see https://aka.ms/vscode-remote/devcontainer.json or this file's README at:
// https://github.com/microsoft/vscode-dev-containers/tree/v0.101.1/containers/docker-existing-docker-compose
// If you want to run as a non-root user in the container, see .devcontainer/docker-compose.yml.
{
	"name": "ioBroker.${adapterNameLowerCase}",

	// Update the 'dockerComposeFile' list if you have more compose files or use different names.
	// The .devcontainer/docker-compose.yml file contains any overrides you need/want to make.
	"dockerComposeFile": [ "docker-compose.yml" ],

 	// Forwarding the nginx port to access ioBroker Admin interface
	"forwardPorts": ["nginx:80"],

	// Name of the forwarded port
	"portsAttributes": {
		"nginx:80": {
			"label": "ioBroker"
		}
	},

	// The 'service' property is the name of the service for the container that VS Code should
	// use. Update this value and .devcontainer/docker-compose.yml to the real service name.
	"service": "iobroker",

	// The optional 'workspaceFolder' property is the path VS Code should open by default when
	// connected. This is typically a file mount in .devcontainer/docker-compose.yml
	"workspaceFolder": "/workspace",

	"customizations": {
		"vscode": {
			// Set *default* container specific settings.json values on container create.
			"settings": {},

			// Add the IDs of extensions you want installed when the container is created.
			"extensions": ${JSON.stringify(extensions)}
		}
	},

	// Uncomment the next line if you want start specific services in your Docker Compose config.
	// "runServices": [],

	// Uncomment the next line if you want to keep your containers running after VS Code shuts down.
	// "shutdownAction": "none",

	// Prepare the devcontainer according to the actual adapter
	"postCreateCommand": "sh .devcontainer/scripts/postcreate.sh",
	"postStartCommand": "sh .devcontainer/scripts/poststart.sh",

	// Connect as non-root user. See https://aka.ms/vscode-remote/containers/non-root.
	"remoteUser": "iobroker"
}
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/devcontainer.json";
export = templateFunction;
