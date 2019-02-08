"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const tools_1 = require("./tools");
const versionCache = new Map();
/**
 * Returns the latest version of an npm package
 * @param packageName The npm package name
 * @param fallbackVersion The fallback version to return in case anything goes wrong. If this is set, no error is thrown.
 */
async function fetchPackageVersion(packageName, fallbackVersion) {
    if (versionCache.has(packageName))
        return versionCache.get(packageName);
    const packageVersion = encodeURIComponent(packageName);
    const url = `https://registry.npmjs.org/-/package/${packageVersion}/dist-tags`;
    let options = { url, timeout: 5000 };
    // If an https-proxy is defined as an env variable, use it
    options = tools_1.applyHttpsProxy(options);
    const response = await axios_1.default(options);
    if (response.status === 200) {
        const version = response.data.latest;
        versionCache.set(pckg, version);
        return version;
    }
    catch (e) {
        if (fallbackVersion)
            return fallbackVersion;
        throw new Error(`Failed to fetch the version for ${packageName} (${e})`);
    }
    if (response.status !== 200) {
        if (fallbackVersion)
            return fallbackVersion;
        throw new Error(`Failed to fetch the version for ${packageName} (${response.status})`);
    }
    const version = response.data.latest;
    versionCache.set(packageName, version);
    return version;
}
exports.fetchPackageVersion = fetchPackageVersion;
