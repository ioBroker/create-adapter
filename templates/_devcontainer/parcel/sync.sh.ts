import { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const template = `
#!/bin/bash
rsync -aiz --inplace --exclude={'node_modules','.git','.cache','admin/build'} /workspace/ /usr/workspace
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/parcel/sync.sh";
templateFunction.noReformat = true;
export = templateFunction;
