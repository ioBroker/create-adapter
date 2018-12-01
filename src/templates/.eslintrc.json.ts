import { Answers } from "../lib/questions";

export = async (answers: Answers) => {

	const useESLint = answers.tools && answers.tools.indexOf("ESLint") > -1;
	if (!useESLint) return;

	const template = `
{
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "no-console": "off",
        "no-var": "error",
        "prefer-const": "error",
        "quotes": [
            "error",
            "single",
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
