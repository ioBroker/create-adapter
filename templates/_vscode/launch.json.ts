import * as JSON5 from "json5";
import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) {
		return;
	}

	const template = `
{
	// Use IntelliSense to learn about possible attributes.
	// Hover to view descriptions of existing attributes.
	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
	"version": "0.2.0",
	"configurations": [
		{
			"type": "node",
			"request": "launch",
			"name": "Launch ioBroker Adapter",
			"skipFiles": ["<node_internals>/**"],
			"args": ["--debug", "0", "--logs"],
			"program": "$\{workspaceFolder}/main.js",
			"console": "integratedTerminal",
		}
	]
}
`;
	return JSON.stringify(JSON5.parse(template), null, 4);
};

templateFunction.customPath = ".vscode/launch.json";
export = templateFunction;
