import { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const template = `
#!/bin/bash
while :
do
  /usr/app/sync.sh
  sleep 1
done
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/parcel/run-sync.sh";
templateFunction.noReformat = true;
export = templateFunction;
