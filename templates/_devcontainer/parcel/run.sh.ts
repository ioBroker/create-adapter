import { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const template = `
#!/bin/bash
echo "Starting initial sync..."
/usr/app/sync.sh

cd /usr/workspace

echo "Installing all dependencies..."
npm install

# run the following two commands in parallel (honoring Ctrl-C)
# - npm run watch:parcel
# - /usr/app/run-sync.sh
(echo "npm run watch:parcel"; echo "/usr/app/run-sync.sh") | xargs -I{} -n 1 -P 2 /bin/bash -c "{}"
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/parcel/run.sh";
templateFunction.noReformat = true;
export = templateFunction;
