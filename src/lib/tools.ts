import { TranslationServiceClient } from "@google-cloud/translate";
import { isArray, isObject } from "alcalzone-shared/typeguards";
import { bold } from "ansi-colors";
import axios, { AxiosRequestConfig } from "axios";
import { spawn, SpawnOptions } from "child_process";
import { Linter } from "eslint";
import * as fs from "fs-extra";
import * as JSON5 from "json5";
import * as os from "os";
import * as path from "path";
import * as prettier from "prettier";
import { URL } from "url";
import { licenses } from "./core/licenses";
import type { Answers } from "./core/questions";

export function error(message: string): void {
	console.error(bold.red(message));
	console.error();
}

export const isWindows = /^win/.test(os.platform());
const isTesting = !!process.env.TESTING;
const useGoogleTranslateV3 = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

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
	exitCode?: number;
	/** The signal the process received before termination */
	signal?: string;
	/** If options.stdout was set to "buffer", this contains the stdout of the spawned process */
	stdout?: string;
	/** If options.stderr was set to "buffer", this contains the stderr of the spawned process */
	stderr?: string;
}

export function executeCommand(
	command: string,
	options?: Partial<ExecuteCommandOptions>,
): Promise<ExecuteCommandResult>;
/**
 * Executes a command and returns the exit code and (if requested) the stdout
 * @param command The command to execute
 * @param args The command line arguments for the command
 * @param options (optional) Some options for the command execution
 */
export function executeCommand(
	command: string,
	args: string[],
	options?: Partial<ExecuteCommandOptions>,
): Promise<ExecuteCommandResult>;
export function executeCommand(
	command: string,
	argsOrOptions?: string[] | Partial<ExecuteCommandOptions>,
	options?: Partial<ExecuteCommandOptions>,
): Promise<ExecuteCommandResult> {
	return new Promise((resolve) => {
		let args: string[] | undefined;
		if (isArray(argsOrOptions)) {
			args = argsOrOptions;
		} else if (isObject(argsOrOptions)) {
			// no args were given
			options = argsOrOptions;
		}
		if (options == null) options = {};
		if (args == null) args = [];

		const spawnOptions: SpawnOptions = {
			stdio: [
				options.stdin || process.stdin,
				options.stdout || process.stdout,
				options.stderr || process.stderr,
			],
			windowsHide: true,
		};
		if (options.cwd != null) spawnOptions.cwd = options.cwd;

		if (options.logCommandExecution == null)
			options.logCommandExecution = false;
		if (options.logCommandExecution) {
			console.log("executing: " + `${command} ${args.join(" ")}`);
		}

		// Now execute the npm process and avoid throwing errors
		try {
			let bufferedStdout: string | undefined;
			let bufferedStderr: string | undefined;
			const cmd = spawn(command, args, spawnOptions).on(
				"close",
				(code, signal) => {
					resolve({
						exitCode: code ?? undefined,
						signal: signal ?? undefined,
						stdout: bufferedStdout,
						stderr: bufferedStderr,
					});
				},
			);
			// Capture stdout/stderr if requested
			if (options.stdout === "pipe") {
				bufferedStdout = "";
				cmd.stdout!.on("data", (chunk) => {
					bufferedStdout += Buffer.isBuffer(chunk)
						? chunk.toString("utf8")
						: chunk;
				});
			}
			if (options.stderr === "pipe") {
				bufferedStderr = "";
				cmd.stderr!.on("data", (chunk) => {
					bufferedStderr += Buffer.isBuffer(chunk)
						? chunk.toString("utf8")
						: chunk;
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
export function enumFilesRecursiveSync(
	dir: string,
	predicate?: (name: string, parentDir: string) => boolean,
): string[] {
	const ret = [];
	if (typeof predicate !== "function") predicate = () => true;
	// enumerate all files in this directory
	const filesOrDirs = fs
		.readdirSync(dir)
		.filter((f) => predicate!(f, dir)) // exclude all files starting with "."
		.map((f) => path.join(dir, f)); // and prepend the full path
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
export function copyFilesRecursiveSync(
	sourceDir: string,
	targetDir: string,
	predicate?: (name: string) => boolean,
): void {
	// Enumerate all files in this module that are supposed to be in the root directory
	const filesToCopy = enumFilesRecursiveSync(sourceDir, predicate);
	// Copy all of them to the corresponding target dir
	for (const file of filesToCopy) {
		// Find out where it's supposed to be
		const targetFileName = path.join(
			targetDir,
			path.relative(sourceDir, file),
		);
		// Ensure the directory exists
		fs.ensureDirSync(path.dirname(targetFileName));
		// And copy the file
		fs.copySync(file, targetFileName);
	}
}

/**
 * Adds https proxy options to an axios request if they were defined as an env variable
 * @param options The options object passed to axios
 */
export function applyHttpsProxy(
	options: AxiosRequestConfig,
): AxiosRequestConfig {
	const proxy: string | undefined =
		process.env.https_proxy || process.env.HTTPS_PROXY;
	if (proxy) {
		try {
			const proxyUrl = new URL(proxy);
			if (proxyUrl.hostname) {
				options.proxy = {
					host: proxyUrl.hostname,
					port: proxyUrl.port ? parseInt(proxyUrl.port, 10) : 443,
				};
			}
		} catch {
			// Invalid URL, don't use proxy
		}
	}
	return options;
}

const translationCache = new Map<string, Map<string, string>>();

async function translateGoogleLegacy(
	text: string,
	targetLang: string,
): Promise<string> {
	if (isTesting) return `Mock translation of '${text}' to '${targetLang}'`;
	if (targetLang === "en") return text;
	try {
		const url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(
			text,
		)}&ie=UTF-8&oe=UTF-8`;
		let options: AxiosRequestConfig = {
			url,
			timeout: getRequestTimeout(),
		};

		// If an https-proxy is defined as an env variable, use it
		options = applyHttpsProxy(options);

		const response = await axios(options);
		if (isArray(response.data)) {
			// we got a valid response
			return response.data[0][0][0];
		}
		error(`Invalid response for translate request`);
	} catch (e: any) {
		if (e.response?.status === 429) {
			error(
				`Could not translate to "${targetLang}": Rate-limited by Google Translate`,
			);
		} else {
			error(`Could not translate to "${targetLang}": ${e}`);
		}
	}
	return text;
}

async function translateGoogleV3(
	text: string,
	targetLang: string,
): Promise<string> {
	if (targetLang === "en") return text;
	let credentials;
	try {
		credentials = await fs.readJson(
			process.env.GOOGLE_APPLICATION_CREDENTIALS || "",
		);
	} catch (error) {
		// if the credentials file is not found, use legacy translation
		return translateGoogleLegacy(text, targetLang);
	}
	try {
		const translationClient = new TranslationServiceClient();
		const request = {
			parent: `projects/${credentials.project_id}/locations/global`,
			contents: [text],
			mimeType: "text/plain",
			sourceLanguageCode: "en",
			targetLanguageCode: targetLang,
		};
		const [response] = await translationClient.translateText(request);
		if (response.translations && response.translations[0]?.translatedText) {
			return response.translations[0].translatedText;
		}
	} catch (e: any) {
		error(`Could not translate to "${targetLang}": ${e}`);
	}

	return text;
}

export async function translateText(
	text: string,
	targetLang: string,
): Promise<string> {
	// Try to read the translation from the translation cache
	if (!translationCache.has(targetLang))
		translationCache.set(targetLang, new Map());
	const langCache = translationCache.get(targetLang)!;
	// or fall back to an online translation
	if (!langCache.has(text)) {
		const doTranslateText = useGoogleTranslateV3
			? translateGoogleV3
			: translateGoogleLegacy;
		langCache.set(text, await doTranslateText(text, targetLang));
	}
	return langCache.get(text)!;
}

export function formatLicense(licenseText: string, answers: Answers): string {
	return licenseText
		.replace(/\[(year|yyyy)\]/g, new Date().getFullYear().toString())
		.replace(/\[(fullname|name of copyright owner)\]/g, answers.authorName)
		.replace(/\[email\]/g, answers.authorEmail);
}

export function getFormattedLicense(answers: Answers): string {
	if (answers.license) {
		const license = licenses[answers.license];
		if (license) {
			return formatLicense(license.text, answers);
		}
	}

	return "TODO: enter license text here";
}

/** Replaces 4-space indentation with tabs */
export function indentWithTabs(text: string): string {
	if (!text) return text;
	return text.replace(/^( {4})+/gm, (match) => "\t".repeat(match.length / 4));
}

/** Replaces tab indentation with 4 spaces */
export function indentWithSpaces(text: string): string {
	if (!text) return text;
	return text.replace(/^(\t)+/gm, (match) => " ".repeat(match.length * 4));
}

/** Normalizes formatting of a JSON string */
export function formatJsonString(
	json: string,
	indentation: "Tab" | "Space (4)",
): string {
	return JSON.stringify(
		JSON5.parse(json),
		null,
		indentation === "Tab" ? "\t" : 4,
	);
}

export enum Quotemark {
	"single" = "'",
	"double" = '"',
}

function createESLintOptions(
	language: Exclude<Answers["language"], undefined>,
	quotes: keyof typeof Quotemark,
): Record<string, any> {
	const baseOptions: Record<string, any> = {
		env: {
			es6: true,
			node: true,
			mocha: true,
		},
		parserOptions: {
			ecmaVersion: 2018,
			ecmaFeatures: {
				jsx: true,
			},
		},
		rules: {
			quotes: [
				"error",
				quotes,
				{
					avoidEscape: true,
					allowTemplateLiterals: true,
				},
			],
		},
	};
	if (language === "TypeScript") {
		baseOptions.parser = "@typescript-eslint/parser";
		baseOptions.parserOptions = {
			...baseOptions.parserOptions,
			sourceType: "module",
		};
	}
	return baseOptions;
}

/** Formats a JS source file to use single quotes */
export function jsFixQuotes(
	sourceText: string,
	quotes: keyof typeof Quotemark,
): string {
	const linter = new Linter();
	const result = linter.verifyAndFix(
		sourceText,
		createESLintOptions("JavaScript", quotes),
	);
	return result.output;
}

/** Formats a TS source file to use single quotes */
export function tsFixQuotes(
	sourceText: string,
	quotes: keyof typeof Quotemark,
): string {
	const linter = new Linter();
	linter.defineParser(
		"@typescript-eslint/parser",
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		require("@typescript-eslint/parser"),
	);
	const result = linter.verifyAndFix(
		sourceText,
		createESLintOptions("TypeScript", quotes),
	);
	return result.output;
}

export function formatWithPrettier(
	sourceText: string,
	answers: Pick<Answers, "quotes" | "indentation">,
	extension: "js" | "ts" | "json",
): string {
	// Keep this in sync with templates/_prettierrc.js.ts
	const prettierOptions: prettier.Options = {
		semi: true,
		trailingComma: "all",
		singleQuote: answers.quotes === "single",
		printWidth: 120,
		useTabs: answers.indentation === "Tab",
		tabWidth: 4,
		endOfLine: "lf",
		// To infer the correct parser
		filepath: `index.${extension}`,
	};
	return prettier.format(sourceText, prettierOptions);
}

export function getOwnVersion(): string {
	for (const jsonPath of ["../../package.json", "../../../package.json"]) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			return require(jsonPath).version;
		} catch (e) {
			/* OK */
		}
	}
	/* istanbul ignore next */
	return "unknown";
}

export function capitalize(name: string): string {
	return name[0].toUpperCase() + name.slice(1);
}

export function kebabCaseToUpperCamelCase(name: string): string {
	return name
		.split(/[_\-]/)
		.filter((part) => part.length > 0)
		.map(capitalize)
		.join("");
}

export function getRequestTimeout(): number {
	let ret: number | undefined;
	if (process.env.REQUEST_TIMEOUT) {
		ret = parseInt(process.env.REQUEST_TIMEOUT, 10);
	}
	if (ret == undefined || Number.isNaN(ret)) return 5000;
	return ret;
}
