import axios from "axios";

const versionCache = new Map<string, string>();

export async function fetchDependencyVersion(dependency: string): Promise<string> {
	if (versionCache.has(dependency)) return versionCache.get(dependency)!;

	const dependencyUrl = encodeURIComponent(dependency);
	const url = `https://registry.npmjs.org/-/package/${dependencyUrl}/dist-tags`;

	const response = await axios({url, timeout: 5000});
	if (response.status === 200) {
		const version = response.data.latest as string;
		versionCache.set(dependency, version);
		return version;
	} else {
		throw new Error(`Failed to fetch the version for ${dependency} (${response.status})`);
	}
}
