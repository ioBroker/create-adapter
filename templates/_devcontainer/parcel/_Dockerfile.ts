import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	const needsParcel = answers.adminReact === "yes" || answers.tabReact === "yes";
	if (!devcontainer || !needsParcel) return;

	const template = `
FROM node:12

RUN mkdir -p /usr/app

COPY *.sh /usr/app/

RUN chmod +x /usr/app/*.sh

CMD /bin/bash -c "/usr/app/run.sh" 
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/parcel/Dockerfile";
export = templateFunction;
