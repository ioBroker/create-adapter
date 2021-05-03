import { expect } from "chai";
import {
	capitalize,
	formatJsonString,
	formatLicense,
	formatWithPrettier,
	getOwnVersion,
	indentWithSpaces,
	indentWithTabs,
	jsFixQuotes,
	kebabCaseToUpperCamelCase,
	tsFixQuotes,
} from "./tools";

describe("tools/error()", () => {
	it.skip("TODO: Cannot test this because console.log should not be stubbed");
});

const indentationTests = [
	{
		spaces: "",
		tabs: "",
	},
	{
		spaces: "no change",
		tabs: "no change",
	},
	{
		spaces: "    test 1",
		tabs: "\ttest 1",
	},
	{
		spaces: "        test 2",
		tabs: "\t\ttest 2",
	},
	{
		spaces: "       test 3",
		tabs: "\t   test 3",
	},
	{
		spaces: "test 4.1\n    test 4.2\n        test 4.3",
		tabs: "test 4.1\n\ttest 4.2\n\t\ttest 4.3",
	},
];

describe("tools/indentWithTabs()", () => {
	it("should replace leading groups of 4 spaces with tabs", () => {
		for (const { spaces, tabs } of indentationTests) {
			expect(indentWithTabs(spaces)).to.equal(tabs);
		}
	});
});

describe("tools/indentWithSpaces()", () => {
	it("should replace leading tabs with groups of 4 spaces", () => {
		for (const { spaces, tabs } of indentationTests) {
			expect(indentWithSpaces(tabs)).to.equal(spaces);
		}
	});
});

describe("tools/jsFixQuotes()", () => {
	it("should change all quotes to single quotes if that is requested", () => {
		const original = `const foo = "";
const bar = "'";
fn1(\`'\`);
fn2('\\"');
`;

		const expected = `const foo = '';
const bar = "'";
fn1(\`'\`);
fn2('\\"');
`;

		expect(jsFixQuotes(original, "single")).to.equal(expected);
	});

	it("should change all quotes to double quotes if that is requested", () => {
		const original = `const foo = '';
const bar = "'";
fn1(\`'\`);
fn2('\\'');
`;

		const expected = `const foo = "";
const bar = "'";
fn1(\`'\`);
fn2("'");
`;

		expect(jsFixQuotes(original, "double")).to.equal(expected);
	});
});

describe("tools/tsFixQuotes()", () => {
	it("should change all quotes to single quotes if that is requested", () => {
		const original = `const foo = "";
const bar = "'";
fn1(\`'\`);
fn2('\\"');
`;

		const expected = `const foo = '';
const bar = "'";
fn1(\`'\`);
fn2('\\"');
`;

		expect(tsFixQuotes(original, "single")).to.equal(expected);
	});

	it("should change all quotes to double quotes if that is requested", () => {
		const original = `const foo = '';
const bar = "'";
fn1(\`'\`);
fn2('\\'');
`;

		const expected = `const foo = "";
const bar = "'";
fn1(\`'\`);
fn2("'");
`;

		expect(tsFixQuotes(original, "double")).to.equal(expected);
	});
});

describe("tools/capitalize()", () => {
	it("should capitalize the first letter in every word", () => {
		const tests = [
			{ original: "abc", expected: "Abc" },
			{ original: "b12", expected: "B12" },
			{ original: "DEF", expected: "DEF" },
			{ original: "123", expected: "123" },
		];

		for (const { original, expected } of tests) {
			expect(capitalize(original)).to.equal(expected);
		}
	});
});

describe("tools/kebabCaseToUpperCamelCase()", () => {
	it("should convert kebab-case to UpperCamelCase", () => {
		const tests = [
			{ original: "foo-bar-baz", expected: "FooBarBaz" },
			{ original: "aaaaa", expected: "Aaaaa" },
			{ original: "DEF", expected: "DEF" },
			{ original: "foo_bar_baz", expected: "FooBarBaz" },
		];

		for (const { original, expected } of tests) {
			expect(kebabCaseToUpperCamelCase(original)).to.equal(expected);
		}
	});
});

describe("tools/getOwnVersion()", () => {
	it("should return the version defined in package.json", () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const expected = require("../../package.json").version;
		expect(getOwnVersion()).to.equal(expected);
	});
});

describe("tools/formatLicense()", () => {
	const answers = { authorName: "John Doe", authorEmail: "foo@bar.com" };

	it("should replace [year] with the current year", () => {
		// MIT License
		const curYear = new Date().getFullYear().toString();
		const tests = [
			{ original: "[year]", expected: curYear },
			{
				original: "Copyright © [year]",
				expected: `Copyright © ${curYear}`,
			},
			{
				original: "[year] [year] [year]",
				expected: `${curYear} ${curYear} ${curYear}`,
			},
		];

		for (const { original, expected } of tests) {
			expect(formatLicense(original, answers as any)).to.equal(expected);
		}
	});

	it("should replace [yyyy] with the current year", () => {
		// Apache License
		const curYear = new Date().getFullYear().toString();
		const tests = [
			{ original: "[yyyy]", expected: curYear },
			{
				original: "Copyright © [yyyy]",
				expected: `Copyright © ${curYear}`,
			},
			{
				original: "[yyyy] [yyyy] [yyyy]",
				expected: `${curYear} ${curYear} ${curYear}`,
			},
		];

		for (const { original, expected } of tests) {
			expect(formatLicense(original, answers as any)).to.equal(expected);
		}
	});

	it("should replace [fullname] with the author's name", () => {
		// MIT License
		const tests = [
			{ original: "[fullname]", expected: answers.authorName },
			{
				original: "[fullname] [fullname] [fullname]",
				expected: `${answers.authorName} ${answers.authorName} ${answers.authorName}`,
			},
		];

		for (const { original, expected } of tests) {
			expect(formatLicense(original, answers as any)).to.equal(expected);
		}
	});

	it("should replace [name of copyright owner] with the author's name", () => {
		// Apache License
		const tests = [
			{
				original: "[name of copyright owner]",
				expected: answers.authorName,
			},
			{
				original:
					"[name of copyright owner] [name of copyright owner] [name of copyright owner]",
				expected: `${answers.authorName} ${answers.authorName} ${answers.authorName}`,
			},
		];

		for (const { original, expected } of tests) {
			expect(formatLicense(original, answers as any)).to.equal(expected);
		}
	});

	it("should replace [email] with the author's email address", () => {
		// MIT License
		const tests = [
			{ original: "[email]", expected: answers.authorEmail },
			{
				original: "[email] [email] [email]",
				expected: `${answers.authorEmail} ${answers.authorEmail} ${answers.authorEmail}`,
			},
		];

		for (const { original, expected } of tests) {
			expect(formatLicense(original, answers as any)).to.equal(expected);
		}
	});
});

describe("tools/formatJsonString()", () => {
	it("should normalize the formatting of JSON strings", () => {
		expect(
			formatJsonString(
				`{
"foo":   "bar",


	"baz": "foo",
			}`,
				"Tab",
			),
		).to.equal(`{
	"foo": "bar",
	"baz": "foo"
}`);
	});
});

describe("tools/formatWithPrettier()", () => {
	it("should format JS code according to the Prettier rules", () => {
		const input = `
foo(
		"baz"
)


function foo() { return;}
`;
		const expected = `foo('baz');\n\nfunction foo() {\n\treturn;\n}\n`;
		expect(
			formatWithPrettier(
				input,
				{ indentation: "Tab", quotes: "single" },
				"js",
			),
		).to.equal(expected);
	});

	it("should format TS code according to the Prettier rules", () => {
		const input = `
foo(
		'baz'
)


function foo() { return;}
`;
		const expected = `foo("baz");\n\nfunction foo() {\n    return;\n}\n`;
		expect(
			formatWithPrettier(
				input,
				{ indentation: "Space (4)", quotes: "double" },
				"ts",
			),
		).to.equal(expected);
	});
});
