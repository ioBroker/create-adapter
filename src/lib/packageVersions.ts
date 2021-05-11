import axios, { AxiosRequestConfig } from "axios";
import * as semver from "semver";
import { applyHttpsProxy, getRequestTimeout } from "./tools";

const allVersionsCache = new Map<string, string[]>();
const latestVersionCache = new Map<string, string>();

export function hasVersionSpecifier(packageName: string): boolean {
	return packageName.lastIndexOf("@") > 0;
}

export function getVersionSpecifier(
	packageNameAndVersion: string,
): string | undefined {
	const atIndex = packageNameAndVersion.lastIndexOf("@");
	if (atIndex > 0) return packageNameAndVersion.slice(atIndex + 1);
}

/** Returns only the package name from a string of the form [@scope/]package-name@version */
export function getPackageName(packageNameAndVersion: string): string {
	const atIndex = packageNameAndVersion.lastIndexOf("@");
	if (atIndex > 0) {
		return packageNameAndVersion.slice(0, atIndex);
	}
	return packageNameAndVersion;
}

/**
 * Returns the latest version of an npm package
 * @param packageName The npm package name
 * @param fallbackVersion The fallback version to return in case anything goes wrong. If this is set, no error is thrown.
 */

async function fetchAllPackageVersions(packageName: string): Promise<string[]> {
	if (allVersionsCache.has(packageName))
		return allVersionsCache.get(packageName)!;

	const packageURIComponent = encodeURIComponent(packageName);
	const url = `https://registry.npmjs.org/${packageURIComponent}`;

	let options: AxiosRequestConfig = { url, timeout: getRequestTimeout() };
	// If an https-proxy is defined as an env variable, use it
	options = applyHttpsProxy(options);

	const response = await axios(options);
	if (response.status !== 200) {
		throw new Error(
			`Failed to fetch the versions for ${packageName} (${response.status})`,
		);
	}
	const allVersions = Object.keys(response.data.versions);
	allVersionsCache.set(packageName, allVersions);
	return allVersions;
}

async function fetchSpecificPackageVersion(
	packageNameAndVersion: string,
	fallbackVersion?: string,
): Promise<string> {
	// A specific version is requested, return the highest version matching the specifier
	try {
		const versionSpecifier = getVersionSpecifier(packageNameAndVersion)!;
		const packageName = getPackageName(packageNameAndVersion);
		const allVersions = await fetchAllPackageVersions(packageName);
		const ret = semver.maxSatisfying(allVersions, versionSpecifier);
		if (!ret)
			throw new Error(
				`No version of ${packageName} found matching ${versionSpecifier}`,
			);
		return ret;
	} catch (e) {
		if (fallbackVersion) return fallbackVersion;
		throw e;
	}
}

async function fetchLatestPackageVersion(
	packageName: string,
	fallbackVersion?: string,
): Promise<string> {
	if (latestVersionCache.has(packageName))
		return latestVersionCache.get(packageName)!;

	const packageURIComponent = encodeURIComponent(packageName);
	const url = `https://registry.npmjs.org/-/package/${packageURIComponent}/dist-tags`;

	let options: AxiosRequestConfig = { url, timeout: getRequestTimeout() };
	// If an https-proxy is defined as an env variable, use it
	options = applyHttpsProxy(options);

	const response = await axios(options);
	if (response.status !== 200) {
		if (fallbackVersion) return fallbackVersion;
		throw new Error(
			`Failed to fetch the version for ${packageName} (${response.status})`,
		);
	}
	const version = response.data.latest as string;
	latestVersionCache.set(packageName, version);
	return version;
}

/**
 * Returns the latest version of an npm package
 * @param packageName The npm package name
 * @param fallbackVersion The fallback version to return in case anything goes wrong. If this is set, no error is thrown.
 */
export async function fetchPackageVersion(
	packageName: string,
	fallbackVersion?: string,
): Promise<string> {
	if (hasVersionSpecifier(packageName)) {
		return fetchSpecificPackageVersion(packageName, fallbackVersion);
	} else {
		return fetchLatestPackageVersion(packageName, fallbackVersion);
	}
}

/**
 * Returns the reference to the version of an npm package
 * @param packageName The npm package name (may include a version specifier like `abc@1.2.3`)
 */
export async function fetchPackageReferenceVersion(
	packageName: string,
): Promise<string> {
	if (hasVersionSpecifier(packageName)) {
		const versionSpecifier = getVersionSpecifier(packageName)!;
		const pureVersionSpec = versionSpecifier.replace(/^[\^~]/, "").trim();
		const versionDepth = pureVersionSpec.replace(/^(0\.)+/, "").split(".")
			.length;
		const version = await fetchSpecificPackageVersion(
			packageName,
			pureVersionSpec,
		);
		if (versionSpecifier.charAt(0) === "^" || versionDepth <= 1) {
			return `^${version}`;
		} else if (versionSpecifier.charAt(0) === "~" || versionDepth == 2) {
			return `~${version}`;
		} else {
			return version;
		}
	} else {
		return `^${await fetchLatestPackageVersion(packageName, "0.0.0")}`;
	}
}
