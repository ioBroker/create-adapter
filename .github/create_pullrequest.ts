import { green, red } from "ansi-colors";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getRequestTimeout } from "../src/lib/tools";

const options: AxiosRequestConfig = {
	headers: {
		Authorization: `token ${process.env.GITHUB_TOKEN}`,
	},
	timeout: getRequestTimeout(),
	method: "POST",
};

(async () => {
	// Create PR

	let createPrResponse: AxiosResponse<any>;
	try {
		createPrResponse = await axios.request<any>({
			...options,
			url: `https://api.github.com/repos/ioBroker/ioBroker.template/pulls`,
			data: {
				title: `Update templates to creator version v${process.env.OWN_VERSION}`,
				body: `This PR updates the templates to the latest version of @ioBroker/create-adapter.`,
				head: `AlCalzone:${process.env.BRANCH_NAME}`,
				base: "master",
			},
		});
	} catch (e: any) {
		createPrResponse = e.response;
		console.error(
			red(`PR creation failed with code ${createPrResponse.status}:
${createPrResponse.statusText}
${JSON.stringify(createPrResponse.data, null, 4)}`),
		);
		return process.exit(1);
	}

	const issueNumber: number = createPrResponse.data.number;
	console.log(`Created PR ${green(`#${issueNumber}`)}`);

	// Add assignees
	/* const assignResponse: Record<string, any> = */
	await axios.request<any>({
		...options,
		url: `https://api.github.com/repos/ioBroker/ioBroker.template/issues/${issueNumber}/assignees`,
		data: {
			assignees: ["AlCalzone", "Apollon77"],
		},
	});
	console.log(`Assigned the PR`);
})();
