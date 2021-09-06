import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	const needsParcel = answers.adminReact === "yes" || answers.tabReact === "yes";
	if (!devcontainer || !needsParcel) return;

	const template = `
#!/bin/bash
cd /workspace

echo "Installing all dependencies..."
npm install

npm run watch:parcel
`;
	return template.trim().replace(/\r\n/g, '\n');
};

templateFunction.customPath = ".devcontainer/parcel/run.sh";
templateFunction.noReformat = true;
export = templateFunction;
