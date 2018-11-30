import { bold, red } from "ansi-colors";
import * as os from "os";
import { executeCommand } from "./executeCommand";

const isWindows = /^win/.test(os.platform());
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export type CheckResult = boolean | "retry";
function error(message: string) {
	console.error(bold.red(message));
	console.error();
}

export async function checkMinSelections(category: string, min: number, answers: any[]): Promise<CheckResult> {
	if (answers.length >= min) return true;
	error(`Please enter at least ${min} ${category}`);
	return "retry";
}

export async function checkAdapterExistence(name: string): Promise<CheckResult> {
	if (!checkName(name)) {
		error("Please enter a valid name!");
		return "retry";
	}

	const result = await executeCommand(isWindows ? "npm.cmd" : "npm", ["view", `iobroker.${name}`, "versions"], { stdout: "ignore", stderr: "ignore" });
	if (result.exitCode === 0) {
		error(`The adapter ioBroker.${name} already exists!`);
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
	return name.replace(/^ioBroker\./i, "");
}
