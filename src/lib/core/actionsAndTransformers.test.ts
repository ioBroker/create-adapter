import { expect } from "chai";
import { stub } from "sinon";
import {
	checkAdapterName,
	checkAuthorName,
	checkEmail,
	checkMinSelections,
	CheckResult,
	checkTitle,
	transformAdapterName,
	transformDescription,
} from "./actionsAndTransformers";

const checkAdapterExistence = stub<string[], Promise<CheckResult>>();

describe("actionsAndTransformers/checkMinSelections()", () => {
	it("should return true if the answers array has at least <min> entries", async () => {
		await checkMinSelections("foo", 3, [1, 2, 3]).should.become(true);
		await checkMinSelections("foo", 2, [1, 2, 3, 4]).should.become(true);
		await checkMinSelections("foo", 1, [1, 2]).should.become(true);
	});

	it("should return an error message otherwise", async () => {
		let result;
		result = await checkMinSelections("foo", 3, [1, 2]);
		result.should.be.a("string").and.match(/at least 3 foo/);

		result = await checkMinSelections("bar", 4, [1, 2]);
		result.should.be.a("string").and.match(/at least 4 bar/);
	});
});

describe("actionsAndTransformers/checkAdapterName()", () => {
	beforeEach(() => checkAdapterExistence.reset());

	it("should not accept empty names", async () => {
		const forbiddenNames = ["", " ", "\t"];
		for (const name of forbiddenNames) {
			const result = await checkAdapterName(name);
			result.should.be.a("string").and.match(/Please enter/);
		}
	});

	it(`should only accept lowercase letters, numbers, "-" and "_"`, async () => {
		const forbiddenNames = ["ö", "$", "foo/bar", "FOO"];
		for (const name of forbiddenNames) {
			const result = await checkAdapterName(name);
			result.should.be.a("string").and.match(/may only consist/);
		}
	});

	it(`should only accept names that start with a letter`, async () => {
		const forbiddenNames = ["1baz", "_foo", "---123b"];
		for (const name of forbiddenNames) {
			const result = await checkAdapterName(name);
			result.should.be.a("string").and.match(/must start with/);
		}
	});

	it(`should only accept names that end with a letter or number`, async () => {
		const forbiddenNames = ["abc-", "foo-bar-_"];
		for (const name of forbiddenNames) {
			const result = await checkAdapterName(name);
			result.should.be.a("string").and.match(/must end with/);
		}
	});

	it("should return an error if the adapter already exists", async () => {
		checkAdapterExistence.resolves(
			"The adapter ioBroker.foo already exists!",
		);
		const result = await checkAdapterName("foo", {
			checkAdapterExistence,
		});
		result.should.be.a("string").and.match(/already exists/);
	});

	it("should not return an error if the check is skipped", async () => {
		await checkAdapterName("foo", {
			checkAdapterExistence: undefined,
		}).should.become(true);
	});

	it("should return true otherwise", async () => {
		checkAdapterExistence.resolves(true);
		await checkAdapterName("foo", {
			checkAdapterExistence,
		}).should.become(true);
	});
});

describe("actionsAndTransformers/checkAuthorName()", () => {
	it("should not accept empty names", async () => {
		const forbidden = ["", " ", "\t"];
		for (const name of forbidden) {
			const result = await checkAuthorName(name);
			result.should.be.a("string").and.match(/Please enter/);
		}
	});
	it("should return true otherwise", async () => {
		await checkAuthorName("Foo").should.become(true);
	});
});

describe("actionsAndTransformers/checkEmail()", () => {
	it("should only accept valid email addresses", async () => {
		const forbidden = ["", " ", "foo@", "bar.de", "foo@bar@baz.de"];
		for (const name of forbidden) {
			const result = await checkEmail(name);
			result.should.be.a("string").and.match(/Please enter/);
		}
	});
	it("should return true for valid email addresses", async () => {
		await checkEmail("test.user@fake-mail.com").should.become(true);
	});
});

describe("actionsAndTransformers/transformAdapterName()", () => {
	it(`should remove leading "ioBroker." from the adapter name`, () => {
		const tests = [
			{ original: "ioBroker.test-adapter", expected: "test-adapter" },
			{ original: "iobroker.test-adapter", expected: "test-adapter" },
			{ original: "ioBrokertest", expected: "ioBrokertest" },
			{ original: "iobrokertest", expected: "iobrokertest" },
		];

		for (const { original, expected } of tests) {
			transformAdapterName(original).should.equal(expected);
		}
	});
});

describe("actionsAndTransformers/transformDescription()", () => {
	it(`should remove leading and trailing spaces`, () => {
		const tests = [
			{
				original: "This is a description",
				expected: "This is a description",
			},
			{
				original: "  This is also a description\t",
				expected: "This is also a description",
			},
		];

		for (const { original, expected } of tests) {
			expect(transformDescription(original)).to.equal(expected);
		}
	});

	it(`should return undefined for empty descriptions`, () => {
		const tests = [
			{ original: " \t ", expected: undefined },
			{ original: "\n\n\r\t", expected: undefined },
		];

		for (const { original, expected } of tests) {
			expect(transformDescription(original)).to.equal(expected);
		}
	});
});

describe("actionsAndTransformers/checkTitle()", () => {
	it("should not accept empty titles", async () => {
		const forbidden = ["", " ", "\t"];
		for (const name of forbidden) {
			const result = await checkTitle(name);
			result.should.be.a("string").and.match(/Please enter/);
		}
	});

	it("should return an error if the title contains iobroker or adapter", async () => {
		const forbidden = [
			"iobroker adapter",
			"adapter test foo",
			"this is for iobroker",
		];
		for (const name of forbidden) {
			const result = await checkTitle(name);
			result.should.be.a("string").and.match(/must not/);
		}
	});

	it("should return true otherwise", async () => {
		checkTitle("foo").should.equal(true);
	});
});
