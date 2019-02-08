import axios, { AxiosRequestConfig } from "axios";
import { applyHttpsProxy } from "./tools";

const versionCache = new Map<string, string>();

export async function fetchPackageVersion(pckg: string): Promise<string> {
	if (versionCache.has(pckg)) return versionCache.get(pckg)!;

	const packageVersion = encodeURIComponent(pckg);
	const url = `https://registry.npmjs.org/-/package/${packageVersion}/dist-tags`;

	let options: AxiosRequestConfig = {url, timeout: 5000};
	// If an https-proxy is defined as an env variable, use it
	options = applyHttpsProxy(options);

	const response = await axios(options);
	if (response.status === 200) {
		const version = response.data.latest as string;
		versionCache.set(pckg, version);
		return version;
	} else {
		throw new Error(`Failed to fetch the version for ${pckg} (${response.status})`);
	}
}
