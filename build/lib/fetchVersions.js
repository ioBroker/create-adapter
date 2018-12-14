"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const versionCache = new Map();
async function fetchDependencyVersion(dependency) {
    if (versionCache.has(dependency))
        return versionCache.get(dependency);
    const dependencyUrl = encodeURIComponent(dependency);
    const url = `https://registry.npmjs.org/-/package/${dependencyUrl}/dist-tags`;
    const response = await axios_1.default({ url, timeout: 5000 });
    if (response.status === 200) {
        const version = response.data.latest;
        versionCache.set(dependency, version);
        return version;
    }
    else {
        throw new Error(`Failed to fetch the version for ${dependency} (${response.status})`);
    }
}
exports.fetchDependencyVersion = fetchDependencyVersion;
