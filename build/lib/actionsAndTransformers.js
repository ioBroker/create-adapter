"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const fetchVersions_1 = require("./fetchVersions");
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
async function checkMinSelections(category, min, answers) {
    if (answers.length >= min)
        return true;
    return `Please enter at least ${min} ${category}`;
}
exports.checkMinSelections = checkMinSelections;
function isAdapterNameValid(name) {
    if (!isNotEmpty(name)) {
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
async function checkAdapterExistence(name) {
    try {
        await fetchVersions_1.fetchPackageVersion(`iobroker.${name}`);
        return `The adapter ioBroker.${name} already exists!`;
    }
    catch (e) {
        return true;
    }
}
async function checkAdapterName(name) {
    const validCheck = isAdapterNameValid(name);
    if (typeof validCheck === "string")
        return validCheck;
    const existenceCheck = await checkAdapterExistence(name);
    if (typeof existenceCheck === "string")
        return existenceCheck;
    return true;
}
exports.checkAdapterName = checkAdapterName;
function checkTitle(title) {
    if (!isNotEmpty(title)) {
        return "Please enter a title!";
    }
    if (/iobroker|adapter/i.test(title)) {
        return `The title must not contain the words "ioBroker" or "adapter"!`;
    }
    return true;
}
exports.checkTitle = checkTitle;
function isNotEmpty(answer) {
    return answer != undefined && answer.length > 0 && answer.trim().length > 0;
}
async function checkAuthorName(name) {
    if (!isNotEmpty(name)) {
        return "Please enter a valid name!";
    }
    return true;
}
exports.checkAuthorName = checkAuthorName;
async function checkEmail(email) {
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address!";
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
function transformDescription(description) {
    description = description.trim();
    if (description.length === 0)
        return undefined;
    return description;
}
exports.transformDescription = transformDescription;
