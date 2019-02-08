"use strict";
const createAdapter_1 = require("../../src/lib/createAdapter");
const templateFunction = answers => {
    if (answers.icon) {
        if (typeof answers.icon === "string") {
            // Try to decode Base64
            const base64Match = answers.icon.match(/^data:image\/(\w+);base64,(.+)$/);
            if (base64Match) {
                return new Buffer(base64Match[2], "base64");
            }
            throw new Error("The icon has an unsupported string encoding!");
        }
        else {
            // Return the raw buffer
            return answers.icon;
        }
    }
    // Fall back to reading the default image
    return createAdapter_1.readFileFromRootDir("../../adapter-creator.png", __dirname, true);
};
templateFunction.customPath = answers => `admin/${answers.adapterName}.png`;
templateFunction.noReformat = true; // Don't format binary files
module.exports = templateFunction;
