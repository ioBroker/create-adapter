"use strict";
const templateFunction = answers => {
    const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
    if (!useESLint)
        return;
    const template = `
{
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            ${answers.indentation === "Tab" ? `"tab"` : "4"},
            {
                "SwitchCase": 1
            }
        ],
        "no-console": "off",
        "no-var": "error",
        "prefer-const": "error",
        "quotes": [
            "error",
            "double",
            {
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ],
        "semi": [
            "error",
            "always"
        ]
    }
}
`;
    return template.trim();
};
templateFunction.customPath = ".eslintrc.json";
module.exports = templateFunction;
