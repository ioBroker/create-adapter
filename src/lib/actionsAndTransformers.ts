import { yellow } from "ansi-colors";
import axios from "axios";
import { fetchPackageVersion } from "./fetchVersions";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export type CheckResult = true | string;
export async function checkMinSelections(category: string, min: number, answers: any[]): Promise<CheckResult> {
	if (answers.length >= min) return true;
	return `Please enter at least ${min} ${category}`;
}

function isAdapterNameValid(name: string): CheckResult {
	if (!checkName(name)) {
		return "Please enter a valid name!";
	}
	const forbiddenChars = /[^a-z0-9\-_]/g;
	if (forbiddenChars.test(name)) {
		name = name.replace(forbiddenChars, "");
		return `The name may only consist of lowercase letters, numbers, "-" and "_"!`;
	}
	if (!/^[a-z]/.test(name)) {
		return `The name must start with a letter!`;
	}
	if (!/[a-z0-9]$/.test(name)) {
		return `The name must end with a letter or number!`;
	}
	return true;
}

async function checkAdapterExistence(name: string): Promise<CheckResult> {
	try {
		await fetchPackageVersion(`iobroker.${name}`);
		return `The adapter ioBroker.${name} already exists!`;
	} catch (e) {
		return true;
	}
}

export async function checkAdapterName(name: string): Promise<CheckResult> {
	const validCheck = isAdapterNameValid(name);
	if (typeof validCheck === "string") return validCheck;

	const existenceCheck = await checkAdapterExistence(name);
	if (typeof existenceCheck === "string") return existenceCheck;

	return true;
}

function checkName(name: string): boolean {
	return name != undefined && name.length > 0 && name.trim().length > 0;
}

export async function checkAuthorName(name: string): Promise<CheckResult> {
	if (!checkName(name)) {
		return "Please enter a valid name!";
	}
	return true;
}

export async function checkEmail(email: string): Promise<CheckResult> {
	if (!emailRegex.test(email)) {
		return "Please enter a valid email address!";
	}
	return true;
}

export function transformAdapterName(name: string): string {
	const startsWithIoBroker = /^ioBroker\./i;
	if (startsWithIoBroker.test(name)) {
		name = name.replace(startsWithIoBroker, "");
		console.log(yellow(`You don't have to prefix the name with "ioBroker."`));
	}
	return name;
}

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

export async function loadLicense(shortName: keyof typeof licenseUrls): Promise<{ id: string, name: string, text: string }> {
	const response = await axios(licenseUrls[shortName]);
	return {
		id: response.data.spdx_id,
		name: response.data.name,
		text: response.data.body,
	};
}
