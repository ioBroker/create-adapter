"use strict";
const createAdapter_1 = require("../src/lib/createAdapter");
const templateFunction = answers => {
    const isAdapter = answers.features.indexOf("adapter") > -1;
    if (!isAdapter)
        return;
    return createAdapter_1.readFile("_travis.raw.yml", __dirname);
};
templateFunction.customPath = ".travis.yml";
// .travis.yml is always formatted with 2 spaces
templateFunction.noReformat = true;
module.exports = templateFunction;
