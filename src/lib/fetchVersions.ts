import axios from "axios";

const versionCache = new Map<string, string>();

export async function fetchPackageVersion(pckg: string): Promise<string> {
	if (versionCache.has(pckg)) return versionCache.get(pckg)!;

	const packageVersion = encodeURIComponent(pckg);
	const url = `https://registry.npmjs.org/-/package/${packageVersion}/dist-tags`;

	let response;
	try {
		response = await axios({url, timeout: 5000});
		if (response.status === 200) {
			const version = response.data.latest as string;
			versionCache.set(pckg, version);
			return version;
		}
	} catch (e) {
		throw new Error(`Failed to fetch the version for ${pckg} (${e})`);
	}
	throw new Error(`Failed to fetch the version for ${pckg} (${response && response.status})`);
}
