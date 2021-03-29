import { expect } from "chai";
import { questions, testCondition } from "./questions";

describe("questions/questions", () => {
	it("should be an array of question objects", () => {
		questions.should.be.an("array");
		questions.forEach((q) => {
			q.should.have.property("type");
			expect(typeof q.type).to.equal("string");
		});
	});
});

describe("questions/testCondition()", () => {
	it("should return true if a question has no condition", () => {
		testCondition(undefined, {}).should.be.true;
		testCondition(null as any, {}).should.be.true;
	});

	it(`for a "value" condition, it should return whether the answer equals the desired value`, () => {
		testCondition(
			{ name: "prop", value: "foo" },
			{ prop: "foo" },
		).should.equal(true);

		testCondition(
			{ name: "prop", value: "bar" },
			{ prop: "foo" },
		).should.equal(false);
	});

	it(`for a "contains" condition, it should return whether the answer array contains the desired value`, () => {
		testCondition(
			{ name: "prop", contains: "foo" },
			{ prop: ["bar", "foo"] },
		).should.equal(true);

		testCondition(
			{ name: "prop", contains: "baz" },
			{ prop: ["bar", "foo"] },
		).should.equal(false);
	});

	it(`for a "doesNotContain" condition, it should return whether the answer array contains the desired value`, () => {
		testCondition(
			{ name: "prop", doesNotContain: "foo" },
			{ prop: ["bar", "foo"] },
		).should.equal(false);

		testCondition(
			{ name: "prop", doesNotContain: "baz" },
			{ prop: ["bar", "foo"] },
		).should.equal(true);
	});

	it("should return false for invalid conditions", () => {
		testCondition({ name: "prop" } as any, {
			prop: ["bar", "foo"],
		}).should.equal(false);
	});

	it("should combine a condition array using AND", () => {
		testCondition(
			[
				{ name: "prop1", doesNotContain: "baz" },
				{ name: "prop2", value: true },
			],
			{
				prop1: ["bar", "foo"],
				prop2: true,
			},
		).should.equal(true);

		testCondition(
			[
				{ name: "prop1", doesNotContain: "baz" },
				{ name: "prop2", value: false },
			],
			{
				prop1: ["bar", "foo"],
				prop2: true,
			},
		).should.equal(false);
	});
});

describe("questions/checkAnswers()", () => {
	it.skip("TODO: This is already tested by test:baselines");
});
describe("questions/formatAnswers()", () => {
	it.skip("TODO: This is already tested by test:baselines");
});
describe("questions/validateAnswers()", () => {
	it.skip("TODO: This is already tested by test:baselines");
});
