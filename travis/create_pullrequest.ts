import { green, red } from "ansi-colors";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const options: AxiosRequestConfig = {
	headers: {
		Authorization: `token ${process.env.GITHUB_TOKEN}`,
	},
	timeout: 5000,
	method: "POST",
};

(async () => {
	// Create PR

	let createPrResponse: AxiosResponse<any>;
	try {
		createPrResponse = await axios({
			...options,
			url: `https://api.github.com/repos/ioBroker/ioBroker.template/pulls`,
			data: {
				title: `Update templates to creator version v${process.env.OWN_VERSION}`,
				body: `This PR updates the templates to the latest version of @ioBroker/create-adapter.`,
				head: "AlCalzone:master",
				base: "master",
			},
		});
	} catch (e) {
		createPrResponse = e.response;
		console.error(red(`PR creation failed with code ${createPrResponse.status}:
${createPrResponse.statusText}
${JSON.stringify(createPrResponse.data, null, 4)}`));
		return process.exit(1);
	}

	const issueNumber: number = createPrResponse.data.number;
	console.log(`Created PR ${green(`#${issueNumber}`)}`);

	// Add assignees
	/* const assignResponse: Record<string, any> = */
	await axios({
		...options,
		url: `https://api.github.com/repos/ioBroker/ioBroker.template/issues/${issueNumber}/assignees`,
		data: {
			assignees: [
				"AlCalzone",
				"Apollon77",
			],
		},
	});
	console.log(`Assigned the PR`);
})();
