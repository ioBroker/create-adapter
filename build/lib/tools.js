"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeguards_1 = require("alcalzone-shared/typeguards");
const ansi_colors_1 = require("ansi-colors");
const axios_1 = require("axios");
const child_process_1 = require("child_process");
const eslint_1 = require("eslint");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const ts = require("typescript");
function error(message) {
    console.error(ansi_colors_1.bold.red(message));
    console.error();
}
exports.error = error;
exports.isWindows = /^win/.test(os.platform());
const isTesting = !!process.env.TESTING;
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
async function translateText(text, targetLang) {
    if (isTesting)
        return `Mock translation of '${text}' to '${targetLang}'`;
    if (targetLang === "en")
        return text;
    try {
        const url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}&ie=UTF-8&oe=UTF-8`;
        const response = await axios_1.default({ url, timeout: 5000 });
        if (typeguards_1.isArray(response.data)) {
            // we got a valid response
            return response.data[0][0][0];
        }
        error(`Invalid response for translate request`);
    }
    catch (e) {
        error(`Could not translate to "${targetLang}": ${e}`);
    }
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
        parserOptions: {
            ecmaVersion: 8,
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
var Quotemark;
(function (Quotemark) {
    Quotemark["single"] = "'";
    Quotemark["double"] = "\"";
})(Quotemark = exports.Quotemark || (exports.Quotemark = {}));
/** Formats a TS source file to use single quotes */
function tsFixQuotes(sourceText, quotes) {
    const newQuotes = Quotemark[quotes];
    const oldQuotes = Quotemark[quotes === "double" ? "single" : "double"];
    // create an AST from the source code, this step is unnecessary if you already have a SourceFile object
    const sourceFile = ts.createSourceFile("fixQuotes.ts", sourceText, ts.ScriptTarget.Latest);
    let resultString = "";
    let lastPos = 0;
    // visit each immediate child node of SourceFile
    ts.forEachChild(sourceFile, function cb(node) {
        if (node.kind === ts.SyntaxKind.StringLiteral && sourceText[node.end - 1] === oldQuotes) {
            // we found a string with the wrong quote style
            const start = node.getStart(sourceFile); // get the position of the opening quotes (this is different from 'node.pos' as it skips all whitespace and comments)
            const rawContent = sourceText.slice(start + 1, node.end - 1); // get the actual contents of the string
            resultString += sourceText.slice(lastPos, start) + newQuotes + escapeQuotes(rawContent, newQuotes, oldQuotes) + newQuotes;
            lastPos = node.end;
        }
        else {
            // recurse deeper down the AST visiting the immediate children of the current node
            ts.forEachChild(node, cb);
        }
    });
    resultString += sourceText.slice(lastPos);
    return resultString;
}
exports.tsFixQuotes = tsFixQuotes;
/** Escape new quotes within the string, unescape the old quotes. */
function escapeQuotes(str, newQuotes, oldQuotes) {
    return str.replace(new RegExp(newQuotes, "g"), `\\${newQuotes}`).replace(new RegExp(`\\\\${oldQuotes}`, "g"), oldQuotes);
}
