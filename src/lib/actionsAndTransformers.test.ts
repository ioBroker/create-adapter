// tslint:disable: no-unused-expression

import { checkMinSelections } from "./actionsAndTransformers";

import * as proxyquireModule from "proxyquire";
import { stub } from "sinon";

const fetchPackageVersion = stub();
const proxyquire = proxyquireModule.noPreserveCache();

const { checkAdapterName } = proxyquire<typeof import ("./actionsAndTransformers")>("./actionsAndTransformers", {
	"./fetchVersions": {
		fetchPackageVersion,
	},
});

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

	beforeEach(() => fetchPackageVersion.reset());

	it("should not accept empty names", async () => {
		const forbiddenNames = [
			"", " ", "\t",
		];
		for (const name of forbiddenNames) {
			const result = await checkAdapterName(name);
			result.should.be.a("string").and.match(/Please enter/);
		}
	});

	it(`should only accept lowercase letters, numbers, "-" and "_"`, async () => {
		const forbiddenNames = [
			"ö", "$", "foo/bar", "FOO",
		];
		for (const name of forbiddenNames) {
			const result = await checkAdapterName(name);
			result.should.be.a("string").and.match(/may only consist/);
		}
	});

	it(`should only accept names that start with a letter`, async () => {
		const forbiddenNames = [
			"1baz", "_foo", "---123b",
		];
		for (const name of forbiddenNames) {
			const result = await checkAdapterName(name);
			result.should.be.a("string").and.match(/must start with/);
		}
	});

	it(`should only accept names that end with a letter or number`, async () => {
		const forbiddenNames = [
			"abc-", "foo-bar-_",
		];
		for (const name of forbiddenNames) {
			const result = await checkAdapterName(name);
			result.should.be.a("string").and.match(/must end with/);
		}
	});

	it("should return an error if the adapter already exists", async () => {
		fetchPackageVersion.resolves("1.2.3");
		const result = await checkAdapterName("foo");
		result.should.be.a("string").and.match(/already exists/);
	});

	it("should return true otherwise", async () => {
		fetchPackageVersion.rejects("404");
		await checkAdapterName("foo").should.become(true);
	});
});
