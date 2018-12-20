// Licenses are cached on build to prevent rate-limiting issues

import { green } from "ansi-colors";
import axios from "axios";
import * as fs from "fs-extra";
import * as path from "path";
import * as yargs from "yargs";
import { License } from "../src/lib/licenses";

// Taken from https://api.github.com/licenses
const licenseUrls = {
	"GNU AGPLv3": "https://api.github.com/licenses/agpl-3.0",
	"GNU GPLv3": "https://api.github.com/licenses/gpl-3.0",
	"GNU LGPLv3": "https://api.github.com/licenses/lgpl-3.0",
	"Mozilla Public License 2.0": "https://api.github.com/licenses/mpl-2.0",
	"Apache License 2.0": "https://api.github.com/licenses/apache-2.0",
	"MIT License": "https://api.github.com/licenses/mit",
	"The Unlicense": "https://api.github.com/licenses/unlicense",
};

const startMarker = "/** BEGIN LICENSES */";
const endMarker = "/** END LICENSES */";
const licenseCacheFile = path.resolve(__dirname, "../src/lib/", "licenses.ts");

async function loadLicense(shortName: keyof typeof licenseUrls): Promise<License> {
	try {
		const response = await axios(licenseUrls[shortName]);
		return {
			id: response.data.spdx_id,
			name: response.data.name,
			text: response.data.body,
		};
	} catch (e) {
		console.error(e);
		throw e;
	}
}

async function loadLicenses() {
	const licenses = {} as Record<keyof typeof licenseUrls, License>;
	for (const shortName of Object.keys(licenseUrls) as (keyof typeof licenseUrls)[]) {
		licenses[shortName] = await loadLicense(shortName);
	}
	return licenses;
}

(async function main() {
	let templateContent = await fs.readFile(licenseCacheFile, "utf8");
	const startMarkerEnd = templateContent.indexOf(startMarker) + startMarker.length;
	const endMarkerStart = templateContent.indexOf(endMarker);
	if (endMarkerStart < startMarkerEnd + 100 || !!yargs.argv.force) {
		// < 100 Bytes is not enough for all licenses, so we need to fetch them
		const licenses = await loadLicenses();
		templateContent =
			templateContent.substr(0, startMarkerEnd)
			+ JSON.stringify(licenses, null, "\t")
			+ templateContent.substr(endMarkerStart)
			;
		await fs.writeFile(licenseCacheFile, templateContent, "utf8");
	} else {
		console.log(green(`Licenses are already cached. Run this with the parameter --force to update them`));
	}
})();
