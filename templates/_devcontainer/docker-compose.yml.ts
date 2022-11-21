import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const adapterNameLowerCase = answers.adapterName.toLowerCase();

	const template = `
version: '3'

services:
    iobroker:
        build: ./iobroker
        container_name: iobroker-${adapterNameLowerCase}
        hostname: iobroker-${adapterNameLowerCase}
        # This port is only internal, so we can work on this while another instance of ioBroker is running on the host
        expose:
            - 8081
        volumes:
            - ..:/workspace:cached
            - iobrokerdata-${adapterNameLowerCase}:/opt/iobroker
        environment:
            - LANG=en_US.UTF-8
            - LANGUAGE=en_US:en
            - LC_ALL=en_US.UTF-8
            - TZ=Europe/Berlin
            - SETGID=1000
    # Reverse proxy to load up-to-date admin sources from the repo
    nginx:
        image: nginx:latest
        depends_on:
            - iobroker
        links:
            - iobroker
        container_name: nginx-${adapterNameLowerCase}
        volumes:
            - ./nginx/nginx.conf:/etc/nginx/nginx.conf
            - ..:/workspace:cached
        ports:
            # Make the ioBroker admin available under http://localhost:8082
            - 8082:80

volumes:
    iobrokerdata-${adapterNameLowerCase}:
`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/docker-compose.yml";
// Reformatting this would create mixed tabs and spaces
templateFunction.noReformat = true;
export = templateFunction;
