import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const devcontainer = answers.tools && answers.tools.includes("devcontainer");
	if (!devcontainer) return;

	const adapterNameLowerCase = answers.adapterName.toLowerCase();
	const needsParcel = answers.adminReact === "yes" || answers.tabReact === "yes";

	const template = `
worker_processes 1;
events { worker_connections 1024; }

http {
  sendfile           on;
  keepalive_timeout  65;

  server {
    listen 80;

    location / {
      proxy_redirect off;
      proxy_pass     http://iobroker:8081;
    }

    location /socket.io/ {
      proxy_pass         http://iobroker:8081;
      proxy_http_version 1.1;
      proxy_set_header   Upgrade $http_upgrade;
      proxy_set_header   Connection "Upgrade";
    }

    location /adapter/${adapterNameLowerCase}/ {
      alias /workspace/admin/;
    }
${needsParcel ? (`
    location /adapter/${adapterNameLowerCase}/build/ {
      proxy_redirect off;
      proxy_pass     http://parcel:1234/;
    }`) : ""}
  }
}`;
	return template.trim();
};

templateFunction.customPath = ".devcontainer/nginx/nginx.conf";
templateFunction.noReformat = true;
export = templateFunction;
