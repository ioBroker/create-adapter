"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const axios_1 = require("axios");
const tools_1 = require("./tools");
const tools_2 = require("./tools");
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
async function checkMinSelections(category, min, answers) {
    if (answers.length >= min)
        return true;
    tools_2.error(`Please enter at least ${min} ${category}`);
    return "retry";
}
exports.checkMinSelections = checkMinSelections;
function isAdapterNameValid(name) {
    if (!checkName(name)) {
        tools_2.error("Please enter a valid name!");
        return false;
    }
    const forbiddenChars = /[^a-z0-9\-_]/g;
    if (forbiddenChars.test(name)) {
        name = name.replace(forbiddenChars, "");
        tools_2.error(`The name may only consist of lowercase letters, numbers, "-" and "_"!`);
        return false;
    }
    if (!/^[a-z]/.test(name)) {
        tools_2.error(`The name should start with a letter!`);
        return false;
    }
    if (!/[a-z0-9]$/.test(name)) {
        tools_2.error(`The name should end with a letter or number!`);
        return false;
    }
    return true;
}
async function checkAdapterExistence(name) {
    const result = await tools_1.executeCommand(tools_1.isWindows ? "npm.cmd" : "npm", ["view", `iobroker.${name}`, "versions"], { stdout: "ignore", stderr: "ignore" });
    if (result.exitCode === 0) {
        tools_2.error(`The adapter ioBroker.${name} already exists!`);
        return false;
    }
    return true;
}
async function checkAdapterName(name) {
    if (!isAdapterNameValid(name) || !await checkAdapterExistence(name)) {
        return "retry";
    }
    return true;
}
exports.checkAdapterName = checkAdapterName;
function checkName(name) {
    return name != undefined && name.length > 0 && name.trim().length > 0;
}
async function checkAuthorName(name) {
    if (!checkName(name)) {
        tools_2.error("Please enter a valid name!");
        return "retry";
    }
    return true;
}
exports.checkAuthorName = checkAuthorName;
async function checkEmail(email) {
    if (!emailRegex.test(email)) {
        tools_2.error("Please enter a valid email address!");
        return "retry";
    }
    return true;
}
exports.checkEmail = checkEmail;
function transformAdapterName(name) {
    const startsWithIoBroker = /^ioBroker\./i;
    if (startsWithIoBroker.test(name)) {
        name = name.replace(startsWithIoBroker, "");
        console.log(ansi_colors_1.yellow(`You don't have to prefix the name with "ioBroker."`));
    }
    return name;
}
exports.transformAdapterName = transformAdapterName;
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
async function loadLicense(shortName) {
    const response = await axios_1.default(licenseUrls[shortName]);
    return {
        id: response.data.spdx_id,
        name: response.data.name,
        text: response.data.body,
    };
}
exports.loadLicense = loadLicense;
