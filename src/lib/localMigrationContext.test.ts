import { expect } from "chai";
import { LocalMigrationContext } from "./localMigrationContext";
import path = require("path");

describe("LocalMigrationContext.directoryExists()", () => {
	it("should return true if the directory exists", async () => {
		const context = new LocalMigrationContext(__dirname);
		expect(await context.directoryExists(".")).to.be.true;
		expect(await context.directoryExists("../..")).to.be.true;
		expect(await context.directoryExists("../../test")).to.be.true;
	});

	it("should return false if the directory doesn't exists", async () => {
		const context = new LocalMigrationContext(__dirname);
		expect(await context.directoryExists("foo")).to.be.false;
		expect(await context.directoryExists("../bar")).to.be.false;
	});

	it("should return false if it isn't a directory", async () => {
		const context = new LocalMigrationContext(__dirname);
		expect(await context.directoryExists("../../package.json")).to.be.false;
		expect(await context.directoryExists("../cli.ts")).to.be.false;
	});
});

describe("LocalMigrationContext.fileExists()", () => {
	it("should return true if the file exists", async () => {
		const context = new LocalMigrationContext(__dirname);
		expect(await context.fileExists("../../package.json")).to.be.true;
		expect(await context.fileExists("../cli.ts")).to.be.true;
	});

	it("should return false if the file doesn't exists", async () => {
		const context = new LocalMigrationContext(__dirname);
		expect(await context.fileExists("../foo.ts")).to.be.false;
		expect(await context.fileExists("../../bar.txt")).to.be.false;
	});

	it("should return false if it isn't a file", async () => {
		const context = new LocalMigrationContext(__dirname);
		expect(await context.fileExists("../..")).to.be.false;
		expect(await context.fileExists("../../test")).to.be.false;
	});
});

describe("LocalMigrationContext.hasFilesWithExtension()", () => {
	it("should return true if files exist", async () => {
		const context = new LocalMigrationContext(__dirname);
		expect(await context.hasFilesWithExtension("../..", ".json")).to.be
			.true;
		expect(await context.hasFilesWithExtension("..", ".ts")).to.be.true;
		expect(
			await context.hasFilesWithExtension(
				"..",
				".ts",
				(f) => !f.endsWith("cli.ts"),
			),
		).to.be.true;
	});

	it("should return false if no files exist", async () => {
		const context = new LocalMigrationContext(__dirname);
		expect(await context.hasFilesWithExtension("..", ".xls")).to.be.false;
		expect(await context.hasFilesWithExtension("..", ".dts")).to.be.false;
		expect(
			await context.hasFilesWithExtension(
				"..",
				".ts",
				(f) => !f.includes("i"),
			),
		).to.be.false;
	});

	it("should return false if the directory doesn't exist", async () => {
		const context = new LocalMigrationContext(__dirname);
		expect(await context.hasFilesWithExtension("foo", ".json")).to.be.false;
		expect(await context.hasFilesWithExtension("../bar", ".ts")).to.be
			.false;
	});
});

describe("LocalMigrationContext.hasDevDependency()", () => {
	it("should return true if the dependency exists", () => {
		const context = new LocalMigrationContext(__dirname);
		context.packageJson = {
			devDependencies: {
				gulp: "^3.9.1",
				mocha: "^4.1.0",
				chai: "^4.1.2",
			},
		};
		expect(context.hasDevDependency("gulp")).to.be.true;
		expect(context.hasDevDependency("mocha")).to.be.true;
		expect(context.hasDevDependency("chai")).to.be.true;
	});

	it("should return false if the dependency doesn't exists", () => {
		const context = new LocalMigrationContext(__dirname);
		context.packageJson = {
			devDependencies: {
				gulp: "^3.9.1",
				mocha: "^4.1.0",
				chai: "^4.1.2",
			},
		};
		expect(context.hasDevDependency("coffee")).to.be.false;
		expect(context.hasDevDependency("chia")).to.be.false;
	});
});

describe("LocalMigrationContext.getMainFileContent()", () => {
	if (!process.env.CI) {
		// not working in GH action as we don't compile the JS code there
		it("should return the contents of the TS file if a main JS file is found with a corresponding TS file", async () => {
			const baseDir = path.resolve(__dirname, "../..");
			const context = new LocalMigrationContext(baseDir);
			context.packageJson = {
				main: "build/src/cli.js",
			};
			expect(await context.getMainFileContent()).not.to.be.empty;
			expect(await context.getMainFileContent()).to.contain(
				"import * as yargs",
			);
		});
	}

	it("should return the contents of the main file if a main file is found with no corresponding TS file", async () => {
		const baseDir = path.resolve(__dirname, "../..");
		const context = new LocalMigrationContext(baseDir);
		context.packageJson = {
			main: "bin/create-adapter.js",
		};
		expect(await context.getMainFileContent()).not.to.be.empty;
		expect(await context.getMainFileContent()).to.contain(
			"#!/usr/bin/env node",
		);
	});

	it("should return an empty string if no main file is found", async () => {
		const baseDir = path.resolve(__dirname, "../..");
		const context = new LocalMigrationContext(baseDir);
		context.packageJson = {
			main: "foo/bar.js",
		};
		expect(await context.getMainFileContent()).to.be.empty;
	});
});

// not working in GH action - but you can still use this test locally
describe("LocalMigrationContext.analyzeCode()", () => {
	if (!process.env.CI) {
		// not working in GH action as we don't compile the JS code there
		it("should return true the first string occurs more than the second", async () => {
			const baseDir = path.resolve(__dirname, "../..");
			const context = new LocalMigrationContext(baseDir);
			context.packageJson = {
				main: "build/src/cli.js",
			};
			expect(await context.analyzeCode("\t", "  ")).to.be.true;
			expect(await context.analyzeCode('"', "'")).to.be.true;
		});
		it("should return false the first string occurs less often than the second", async () => {
			const baseDir = path.resolve(__dirname, "../..");
			const context = new LocalMigrationContext(baseDir);
			context.packageJson = {
				main: "build/src/cli.js",
			};
			expect(await context.analyzeCode("  ", "\t")).to.be.false;
			expect(await context.analyzeCode("'", '"')).to.be.false;
		});
	}
});
