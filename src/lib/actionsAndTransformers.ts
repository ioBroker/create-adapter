import { yellow } from "ansi-colors";
import axios from "axios";
import { executeCommand, isWindows } from "./tools";
import { error } from "./tools";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export type CheckResult = boolean | "retry";
export async function checkMinSelections(category: string, min: number, answers: any[]): Promise<CheckResult> {
	if (answers.length >= min) return true;
	error(`Please enter at least ${min} ${category}`);
	return "retry";
}

function isAdapterNameValid(name: string): boolean {
	if (!checkName(name)) {
		error("Please enter a valid name!");
		return false;
	}
	const forbiddenChars = /[^a-z0-9\-_]/g;
	if (forbiddenChars.test(name)) {
		name = name.replace(forbiddenChars, "");
		error(`The name may only consist of lowercase letters, numbers, "-" and "_"!`);
		return false;
	}
	if (!/^[a-z]/.test(name)) {
		error(`The name should start with a letter!`);
		return false;
	}
	if (!/[a-z0-9]$/.test(name)) {
		error(`The name should end with a letter or number!`);
		return false;
	}
	return true;
}

async function checkAdapterExistence(name: string): Promise<boolean> {
	const result = await executeCommand(isWindows ? "npm.cmd" : "npm", ["view", `iobroker.${name}`, "versions"], { stdout: "ignore", stderr: "ignore" });
	if (result.exitCode === 0) {
		error(`The adapter ioBroker.${name} already exists!`);
		return false;
	}
	return true;
}

export async function checkAdapterName(name: string): Promise<CheckResult> {
	if (!isAdapterNameValid(name) || !await checkAdapterExistence(name)) {
		return "retry";
	}
	return true;
}

function checkName(name: string): boolean {
	return name != undefined && name.length > 0 && name.trim().length > 0;
}

export async function checkAuthorName(name: string): Promise<CheckResult> {
	if (!checkName(name)) {
		error("Please enter a valid name!");
		return "retry";
	}
	return true;
}

export async function checkEmail(email: string): Promise<CheckResult> {
	if (!emailRegex.test(email)) {
		error("Please enter a valid email address!");
		return "retry";
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
