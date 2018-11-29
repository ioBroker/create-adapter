import * as os from "os";
import { executeCommand } from "./executeCommand";

const isWindows = /^win/.test(os.platform());
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export type CheckResult = boolean | "retry";

export async function checkAdapterExistence(name: string): Promise<CheckResult> {
	const result = await executeCommand(isWindows ? "npm.cmd" : "npm", ["view", `iobroker.${name}`, "versions"], {stdout: "ignore", stderr: "ignore"});
	if (result.exitCode === 0) {
		console.error(`The adapter ioBroker.${name} already exists!`);
		return "retry";
	}
	return true;
}

export async function checkAuthorName(name: string): Promise<CheckResult> {
	if (
		name.length > 0 && name.trim().length > 0
	) {
		return true;
	}
	console.error("Please enter a valid name!");
	return "retry";
}

export async function checkEmail(email: string): Promise<CheckResult> {
	if (!emailRegex.test(email)) {
		console.error("Please enter a valid email address!");
		return "retry";
	}
	return true;
}
