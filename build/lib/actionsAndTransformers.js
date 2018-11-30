"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const os = require("os");
const executeCommand_1 = require("./executeCommand");
const isWindows = /^win/.test(os.platform());
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function error(message) {
    console.error(ansi_colors_1.bold.red(message));
    console.error();
}
function checkMinSelections(category, min, answers) {
    return __awaiter(this, void 0, void 0, function* () {
        if (answers.length >= min)
            return true;
        error(`Please enter at least ${min} ${category}`);
        return "retry";
    });
}
exports.checkMinSelections = checkMinSelections;
function checkAdapterExistence(name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!checkName(name)) {
            error("Please enter a valid name!");
            return "retry";
        }
        const result = yield executeCommand_1.executeCommand(isWindows ? "npm.cmd" : "npm", ["view", `iobroker.${name}`, "versions"], { stdout: "ignore", stderr: "ignore" });
        if (result.exitCode === 0) {
            error(`The adapter ioBroker.${name} already exists!`);
            return "retry";
        }
        return true;
    });
}
exports.checkAdapterExistence = checkAdapterExistence;
function checkName(name) {
    return name != undefined && name.length > 0 && name.trim().length > 0;
}
function checkAuthorName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!checkName(name)) {
            error("Please enter a valid name!");
            return "retry";
        }
        return true;
    });
}
exports.checkAuthorName = checkAuthorName;
function checkEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!emailRegex.test(email)) {
            error("Please enter a valid email address!");
            return "retry";
        }
        return true;
    });
}
exports.checkEmail = checkEmail;
function transformAdapterName(name) {
    return name.replace(/^ioBroker\./i, "");
}
exports.transformAdapterName = transformAdapterName;
//# sourceMappingURL=actionsAndTransformers.js.map