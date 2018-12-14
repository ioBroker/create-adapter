"use strict";
const fs = require("fs-extra");
const path = require("path");
const templateFunction = () => fs.readFile(path.join(__dirname, "../../../adapter-creator.png"));
templateFunction.customPath = answers => `admin/${answers.adapterName}.png`;
templateFunction.noReformat = true; // Don't format binary files
module.exports = templateFunction;
