import { isArray, isObject } from "alcalzone-shared/typeguards";
import { bold } from "ansi-colors";
import { spawn, SpawnOptions } from "child_process";
import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";

export function error(message: string) {
	console.error(bold.red(message));
	console.error();
}

export const isWindows = /^win/.test(os.platform());

export interface ExecuteCommandOptions {
	/** Whether the executed command should be logged to the stdout. Default: false */
	logCommandExecution: boolean;
	/** The directory to execute the command in */
	cwd: string;
	/** Where to redirect the stdin. Default: process.stdin */
	stdin: NodeJS.ReadStream;
	/** A write stream to redirect the stdout, "ignore" to ignore it or "pipe" to return it as a string. Default: process.stdout */
	stdout: NodeJS.WriteStream | "pipe" | "ignore";
	/** A write stream to redirect the stderr, "ignore" to ignore it or "pipe" to return it as a string. Default: process.stderr */
	stderr: NodeJS.WriteStream | "pipe" | "ignore";
}

export interface ExecuteCommandResult {
	/** The exit code of the spawned process */
	exitCode: number;
	/** The signal the process received before termination */
	signal?: string;
	/** If options.stdout was set to "buffer", this contains the stdout of the spawned process */
	stdout?: string;
	/** If options.stderr was set to "buffer", this contains the stderr of the spawned process */
	stderr?: string;
}

export function executeCommand(command: string, options?: Partial<ExecuteCommandOptions>): Promise<ExecuteCommandResult>;
/**
 * Executes a command and returns the exit code and (if requested) the stdout
 * @param command The command to execute
 * @param args The command line arguments for the command
 * @param options (optional) Some options for the command execution
 */
export function executeCommand(command: string, args: string[], options?: Partial<ExecuteCommandOptions>): Promise<ExecuteCommandResult>;
export function executeCommand(command: string, argsOrOptions?: string[] | Partial<ExecuteCommandOptions>, options?: Partial<ExecuteCommandOptions>): Promise<ExecuteCommandResult> {
	let args: string[] | undefined;
	if (isArray(argsOrOptions)) {
		args = argsOrOptions;
	} else if (isObject(argsOrOptions)) {
		// no args were given
		options = argsOrOptions as Partial<ExecuteCommandOptions>;
	}
	if (options == null) options = {};
	if (args == null) args = [];

	const spawnOptions: SpawnOptions = {
		stdio: [
			options.stdin || process.stdin,
			options.stdout || process.stdout,
			options.stderr || process.stderr,
		],
		// @ts-ignore This option exists starting with NodeJS 8
		windowsHide: true,
	};
	if (options.cwd != null) spawnOptions.cwd = options.cwd;

	if (options.logCommandExecution == null) options.logCommandExecution = false;
	if (options.logCommandExecution) {
		console.log(
			"executing: "
			+ `${command} ${args.join(" ")}`,
		);
	}

	// Now execute the npm process and avoid throwing errors
	return new Promise((resolve) => {
		try {
			let bufferedStdout: string | undefined;
			let bufferedStderr: string | undefined;
			const cmd = spawn(command, args, spawnOptions)
				.on("close", (code, signal) => {
					resolve({
						exitCode: code,
						signal,
						stdout: bufferedStdout,
						stderr: bufferedStderr,
					});
				});
			// Capture stdout/stderr if requested
			if (options!.stdout === "pipe") {
				bufferedStdout = "";
				cmd.stdout.on("data", chunk => {
					const buffer = Buffer.isBuffer(chunk)
						? chunk
						: new Buffer(chunk, "utf8")
						;
					bufferedStdout! += buffer;
				});
			}
			if (options!.stderr === "pipe") {
				bufferedStderr = "";
				cmd.stderr.on("data", chunk => {
					const buffer = Buffer.isBuffer(chunk)
						? chunk
						: new Buffer(chunk, "utf8")
						;
					bufferedStderr! += buffer;
				});
			}
		} catch (e) {
			// doesn't matter, we return the exit code in the "close" handler
		}
	});
}

/**
 * Recursively enumerates all files in the given directory
 * @param dir The directory to scan
 * @param predicate An optional predicate to apply to every found file system entry
 * @returns A list of all files found
 */
export function enumFilesRecursiveSync(dir: string, predicate?: (name: string, parentDir: string) => boolean): string[] {
	const ret = [];
	if (typeof predicate !== "function") predicate = () => true;
	// enumerate all files in this directory
	const filesOrDirs = fs.readdirSync(dir)
		.filter(f => predicate!(f, dir)) // exclude all files starting with "."
		.map(f => path.join(dir, f)) // and prepend the full path
		;
	for (const entry of filesOrDirs) {
		if (fs.statSync(entry).isDirectory()) {
			// Continue recursing this directory and remember the files there
			ret.push(...enumFilesRecursiveSync(entry, predicate));
		} else {
			// remember this file
			ret.push(entry);
		}
	}
	return ret;
}

/**
 * Recursively copies all files from the source to the target directory
 * @param sourceDir The directory to scan
 * @param targetDir The directory to copy to
 * @param predicate An optional predicate to apply to every found file system entry
 */
export function copyFilesRecursiveSync(sourceDir: string, targetDir: string, predicate?: (name: string) => boolean) {
	// Enumerate all files in this module that are supposed to be in the root directory
	const filesToCopy = enumFilesRecursiveSync(sourceDir, predicate);
	// Copy all of them to the corresponding target dir
	for (const file of filesToCopy) {
		// Find out where it's supposed to be
		const targetFileName = path.join(targetDir, path.relative(sourceDir, file));
		// Ensure the directory exists
		fs.ensureDirSync(path.dirname(targetFileName));
		// And copy the file
		fs.copySync(file, targetFileName);
	}
}

export async function translateText(text: string, language: string): Promise<string> {
	// TODO: implement
	return text;
}
