"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
async function checkAdapterExistence(name) {
    if (!checkName(name)) {
        tools_2.error("Please enter a valid name!");
        return "retry";
    }
    const result = await tools_1.executeCommand(tools_1.isWindows ? "npm.cmd" : "npm", ["view", `iobroker.${name}`, "versions"], { stdout: "ignore", stderr: "ignore" });
    if (result.exitCode === 0) {
        tools_2.error(`The adapter ioBroker.${name} already exists!`);
        return "retry";
    }
    return true;
}
exports.checkAdapterExistence = checkAdapterExistence;
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
    return name.replace(/^ioBroker\./i, "");
}
exports.transformAdapterName = transformAdapterName;
