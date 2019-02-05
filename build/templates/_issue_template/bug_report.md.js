"use strict";
const createAdapter_1 = require("../../src/lib/createAdapter");
const templateFunction = answers => {
    return createAdapter_1.readFile("bug_report.raw.md", __dirname);
};
templateFunction.customPath = ".github/ISSUE_TEMPLATE/bug_report.md";
module.exports = templateFunction;
