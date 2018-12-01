"use strict";
module.exports = async (answers) => {
    const useTypeScript = answers.language === "TypeScript";
    if (!useTypeScript)
        return;
    const template = `
// This is a fallback in case ioBroker does not find the compiled main.js
require("./build/main.js");
`;
    return template.trim();
};
