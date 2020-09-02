import { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const template = `
FROM node:12

RUN apt-get update && apt-get install -y rsync

RUN mkdir -p /usr/app
RUN mkdir -p /usr/workspace

COPY *.sh /usr/app/

CMD /bin/bash -c "/usr/app/run.sh" 
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/parcel/Dockerfile";
export = templateFunction;
