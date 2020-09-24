import { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const template = `
#!/bin/bash
cd /workspace

echo "Installing all dependencies..."
npm install

npm run watch:parcel
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/parcel/run.sh";
templateFunction.noReformat = true;
export = templateFunction;
