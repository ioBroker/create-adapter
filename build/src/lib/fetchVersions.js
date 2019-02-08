"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const tools_1 = require("./tools");
const versionCache = new Map();
async function fetchPackageVersion(pckg) {
    if (versionCache.has(pckg))
        return versionCache.get(pckg);
    const packageVersion = encodeURIComponent(pckg);
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
    else {
        throw new Error(`Failed to fetch the version for ${pckg} (${response.status})`);
    }
}
exports.fetchPackageVersion = fetchPackageVersion;
