"use strict";
const createAdapter_1 = require("../../src/lib/createAdapter");
const templateFunction = () => createAdapter_1.readFileFromRootDir("../../adapter-creator.png", __dirname, true);
templateFunction.customPath = answers => `admin/${answers.adapterName}.png`;
templateFunction.noReformat = true; // Don't format binary files
module.exports = templateFunction;
