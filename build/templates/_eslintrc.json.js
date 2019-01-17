"use strict";
const JSON5 = require("json5");
const templateFunction = answers => {
    const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
    if (!useESLint)
        return;
    const ecmaVersion = answers.ecmaVersion || 2017;
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
            "${typeof answers.quotes === "string" ? answers.quotes : "double"}",
            {
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ],
        "semi": [
            "error",
            "always"
        ]
	},
	${ecmaVersion > 2015 ? (`
		"parserOptions": {
			"ecmaVersion": ${ecmaVersion}
		}
	`) : ""}
}
`;
    return JSON.stringify(JSON5.parse(template), null, 4);
};
templateFunction.customPath = ".eslintrc.json";
module.exports = templateFunction;
