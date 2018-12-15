"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeguards_1 = require("alcalzone-shared/typeguards");
const ansi_colors_1 = require("ansi-colors");
const child_process_1 = require("child_process");
const eslint_1 = require("eslint");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
function error(message) {
    console.error(ansi_colors_1.bold.red(message));
    console.error();
}
exports.error = error;
exports.isWindows = /^win/.test(os.platform());
function executeCommand(command, argsOrOptions, options) {
    let args;
    if (typeguards_1.isArray(argsOrOptions)) {
        args = argsOrOptions;
    }
    else if (typeguards_1.isObject(argsOrOptions)) {
        // no args were given
        options = argsOrOptions;
    }
    if (options == null)
        options = {};
    if (args == null)
        args = [];
    const spawnOptions = {
        stdio: [
            options.stdin || process.stdin,
            options.stdout || process.stdout,
            options.stderr || process.stderr,
        ],
        // @ts-ignore This option exists starting with NodeJS 8
        windowsHide: true,
    };
    if (options.cwd != null)
        spawnOptions.cwd = options.cwd;
    if (options.logCommandExecution == null)
        options.logCommandExecution = false;
    if (options.logCommandExecution) {
        console.log("executing: "
            + `${command} ${args.join(" ")}`);
    }
    // Now execute the npm process and avoid throwing errors
    return new Promise((resolve) => {
        try {
            let bufferedStdout;
            let bufferedStderr;
            const cmd = child_process_1.spawn(command, args, spawnOptions)
                .on("close", (code, signal) => {
                resolve({
                    exitCode: code,
                    signal,
                    stdout: bufferedStdout,
                    stderr: bufferedStderr,
                });
            });
            // Capture stdout/stderr if requested
            if (options.stdout === "pipe") {
                bufferedStdout = "";
                cmd.stdout.on("data", chunk => {
                    const buffer = Buffer.isBuffer(chunk)
                        ? chunk
                        : new Buffer(chunk, "utf8");
                    bufferedStdout += buffer;
                });
            }
            if (options.stderr === "pipe") {
                bufferedStderr = "";
                cmd.stderr.on("data", chunk => {
                    const buffer = Buffer.isBuffer(chunk)
                        ? chunk
                        : new Buffer(chunk, "utf8");
                    bufferedStderr += buffer;
                });
            }
        }
        catch (e) {
            // doesn't matter, we return the exit code in the "close" handler
        }
    });
}
exports.executeCommand = executeCommand;
/**
 * Recursively enumerates all files in the given directory
 * @param dir The directory to scan
 * @param predicate An optional predicate to apply to every found file system entry
 * @returns A list of all files found
 */
function enumFilesRecursiveSync(dir, predicate) {
    const ret = [];
    if (typeof predicate !== "function")
        predicate = () => true;
    // enumerate all files in this directory
    const filesOrDirs = fs.readdirSync(dir)
        .filter(f => predicate(f, dir)) // exclude all files starting with "."
        .map(f => path.join(dir, f)) // and prepend the full path
    ;
    for (const entry of filesOrDirs) {
        if (fs.statSync(entry).isDirectory()) {
            // Continue recursing this directory and remember the files there
            ret.push(...enumFilesRecursiveSync(entry, predicate));
        }
        else {
            // remember this file
            ret.push(entry);
        }
    }
    return ret;
}
exports.enumFilesRecursiveSync = enumFilesRecursiveSync;
/**
 * Recursively copies all files from the source to the target directory
 * @param sourceDir The directory to scan
 * @param targetDir The directory to copy to
 * @param predicate An optional predicate to apply to every found file system entry
 */
function copyFilesRecursiveSync(sourceDir, targetDir, predicate) {
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
exports.copyFilesRecursiveSync = copyFilesRecursiveSync;
async function translateText(text, language) {
    // TODO: implement
    return text;
}
exports.translateText = translateText;
function formatLicense(licenseText, answers) {
    return licenseText
        .replace(/\[year\]/g, new Date().getFullYear().toString())
        .replace(/\[fullname\]/g, answers.authorName);
}
exports.formatLicense = formatLicense;
/** Replaces 4-space indentation with tabs */
function indentWithTabs(text) {
    if (!text)
        return text;
    return text.replace(/^( {4})+/gm, match => "\t".repeat(match.length / 4));
}
exports.indentWithTabs = indentWithTabs;
/** Replaces tab indentation with 4 spaces */
function indentWithSpaces(text) {
    if (!text)
        return text;
    return text.replace(/^(\t)+/gm, match => " ".repeat(match.length * 4));
}
exports.indentWithSpaces = indentWithSpaces;
/** Formats a JS source file to use single quotes */
function jsFixQuotes(sourceText, quotes) {
    const linter = new eslint_1.Linter();
    const result = linter.verifyAndFix(sourceText, {
        env: {
            es6: true,
            node: true,
            mocha: true,
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
    });
    return result.output;
}
exports.jsFixQuotes = jsFixQuotes;
