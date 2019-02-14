// tslint:disable: no-unused-expression

import { expect } from "chai";
import * as path from "path";
import * as proxyquireModule from "proxyquire";
import { stub } from "sinon";
const proxyquire = proxyquireModule.noPreserveCache();

const fsStub = {
	outputFile: stub(),
	readFile: stub(),
	pathExists: stub(),
	reset() {
		this.readFile.reset();
		this.outputFile.reset();
	},
};

import { testCondition } from "./createAdapter";
// tslint:disable-next-line: whitespace
const { readFile, readFileFromRootDir } = proxyquire<typeof import("./createAdapter")>("./createAdapter", {
	"fs": fsStub,
	"fs-extra": fsStub,
});

describe("createAdapter/testCondition()", () => {
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
		testCondition(
			{ name: "prop" } as any,
			{ prop: ["bar", "foo"] },
		).should.equal(false);
	});

	it("should combine a condition array using AND", () => {
		testCondition(
			[
				{ name: "prop1", doesNotContain: "baz" },
				{ name: "prop2", value: true },
			],
			{ prop1: ["bar", "foo"], prop2: true },
		).should.equal(true);

		testCondition(
			[
				{ name: "prop1", doesNotContain: "baz" },
				{ name: "prop2", value: false },
			],
			{ prop1: ["bar", "foo"], prop2: true },
		).should.equal(false);
	});
});

describe("createAdapter/readFile()", () => {

	beforeEach(() => fsStub.reset());

	it("calls fs.readFile with the absolute path", async () => {
		fsStub.readFile.resolves();
		await readFile("../filename", "dir/lib/what", false);
		fsStub.readFile.should.have.been.calledOnceWith(path.normalize("dir/lib/filename"));
	});

	it(`passes "utf8" as the encoding when the binary option is false`, async () => {
		fsStub.readFile.resolves();
		await readFile("../filename", "dir/lib/what", false);
		fsStub.readFile.should.have.been.calledWithMatch(/./, "utf8");
	});

	it(`passes "utf8" as the encoding when the binary option is missing`, async () => {
		fsStub.readFile.resolves();
		await readFile("../filename", "dir/lib/what");
		fsStub.readFile.should.have.been.calledWithMatch(/./, "utf8");
	});

	it(`does not pass an encoding when the binary option is true`, async () => {
		fsStub.readFile.resolves();
		await readFile("../filename", "dir/lib/what", true);
		fsStub.readFile.should.have.been.calledOnceWithExactly(path.normalize("dir/lib/filename"));
	});

	it("returns the raw value from fs.readFile", async () => {
		fsStub.readFile.resolves("foo");
		await readFile("../filename", "dir/lib/what", false).should.become("foo");

		fsStub.readFile.resolves("bar");
		await readFile("../filename", "dir/lib/what", false).should.become("bar");
	});

});

describe("createAdapter/readFile()", () => {

	beforeEach(() => fsStub.reset());

	it("reads the file if it exists in the expected location", async () => {
		const expectedPath = path.normalize("dir/lib/foo");
		fsStub.pathExists
			.withArgs(expectedPath)
			.resolves(true)
		;
		await readFileFromRootDir("./foo", "dir/lib/");
		fsStub.readFile.should.have.been.calledWith(expectedPath);
	});

	it("reads the file from the parent directory otherwise", async () => {
		const expectedPath = path.normalize("dir/lib/foo");
		const parentPath = path.normalize("dir/foo");
		fsStub.pathExists
			.withArgs(expectedPath)
			.resolves(false)
		;
		await readFileFromRootDir("./foo", "dir/lib/");
		fsStub.readFile.should.have.been.calledWith(parentPath);
	});

});
