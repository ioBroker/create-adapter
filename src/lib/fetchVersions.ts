import axios, { AxiosRequestConfig } from "axios";
import { applyHttpsProxy } from "./tools";

const versionCache = new Map<string, string>();

/**
 * Returns the latest version of an npm package
 * @param packageName The npm package name
 * @param fallbackVersion The fallback version to return in case anything goes wrong. If this is set, no error is thrown.
 */
export async function fetchPackageVersion(packageName: string, fallbackVersion?: string): Promise<string> {
	if (versionCache.has(packageName)) return versionCache.get(packageName)!;

	const packageVersion = encodeURIComponent(packageName);
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
	if (response.status !== 200) {
		if (fallbackVersion) return fallbackVersion;
		throw new Error(`Failed to fetch the version for ${packageName} (${response.status})`);
	}
	const version = response.data.latest as string;
	versionCache.set(packageName, version);
	return version;
}
