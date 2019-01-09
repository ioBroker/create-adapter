import { TemplateFunction } from "../lib/createAdapter";

export = (answers => {

	const useTSLint = answers.tools && answers.tools.indexOf("TSLint") > -1;
	if (!useTSLint) return;

	const template = `
{
    "enable": true,
    "extends": [
        "tslint:recommended"
    ],
    "rules": {
        "indent": [true, "${answers.indentation === "Tab" ? "tabs" : "spaces"}", 4],
        "object-literal-sort-keys": false,
        "object-literal-shorthand": false,
        "array-type": [true, "array"],
        "max-line-length": [false],
        "interface-name": [false],
        "variable-name": [
            true,
            "ban-keywords",
            "check-format", "allow-leading-underscore", "allow-trailing-underscore"
        ],
        "member-ordering": [false],
        "curly": [true, "ignore-same-line"],
        "triple-equals": [true, "allow-undefined-check", "allow-null-check"],
        "arrow-parens": false,
        "no-bitwise": false,
        "max-classes-per-file": false,
        "quotemark": [true, "${typeof answers.quotes === "string" ? answers.quotes : "double"}", "avoid-escape"],
        "no-console": true
    }
}
`;
	return template.trim();
}) as TemplateFunction;
