
import { expect } from "chai";
import { isQuestionGroup, questions } from "./questions";

describe("questions/isQuestionGroup()", () => {
	it("should return false if the argument is null or undefined", () => {
		isQuestionGroup(undefined).should.be.false;
		isQuestionGroup(null).should.be.false;
	});

	it(`should return false if the argument doesn't have a string property "headline"`, () => {
		for (const arg of [
			{}, [], "whatever", { foo: "bar" }, 1, true,
			{ headline: 1 }, { headline: false },
		]) isQuestionGroup(arg).should.be.false;
	});

	it(`should return false if the argument doesn't have an array property "questions"`, () => {
		for (const arg of [
			{ headline: "headline" },
			{ headline: "headline", questions: {} },
			{ headline: "headline", questions: 1 },
			{ headline: "headline", questions: false },
		]) isQuestionGroup(arg).should.be.false;
	});

	it("should return true otherwise", () => {
		isQuestionGroup({ headline: "string", questions: [] }).should.be.true;
	});
});

describe("questions/questions", () => {
	it("should be an array of question objects", () => {
		questions.should.be.an("array");
		questions.forEach(q => {
			q.should.have.property("type");
			expect(typeof q.type).to.equal("string");
		});
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
