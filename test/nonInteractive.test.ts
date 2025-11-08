/**
 * Tests for non-interactive mode CLI option
 */

import { expect } from "chai";
import { execaSync } from "execa";
import * as fs from "fs-extra";
import * as path from "path";

const rootDir = path.join(__dirname, "..");
const binPath = path.join(rootDir, "bin/create-adapter.js");

describe("Non-interactive mode", () => {
	const testDir = path.join(__dirname, "../.tmp-test-noninteractive");

	beforeEach(async () => {
		await fs.ensureDir(testDir);
	});

	afterEach(async () => {
		await fs.remove(testDir);
	});

	it("should fail with missing required fields and show error message", async () => {
		// Create an incomplete .create-adapter.json file
		const incompleteAnswers = {
			cli: true,
			target: "directory",
			adapterName: "test-adapter",
			title: "Test Adapter",
		};

		const replayFile = path.join(testDir, ".create-adapter.json");
		await fs.writeJson(replayFile, incompleteAnswers);

		// Run the CLI in non-interactive mode
		try {
			execaSync("node", [binPath, `--replay=${replayFile}`, "--non-interactive", "--no-install"], {
				cwd: testDir,
				encoding: "utf8",
			});
			// Should not reach here
			expect.fail("Expected process to exit with error");
		} catch (error: any) {
			// Check that it exited with non-zero code
			expect(error.exitCode).to.equal(1);

			// Check that the error output contains expected messages
			const output = error.stdout + error.stderr;
			expect(output).to.include("ERROR: Missing required fields");
			expect(output).to.include("Author Name");
			expect(output).to.include("authorName");
		}
	});

	it("should show allowed values for fields with choices", async () => {
		// Create an incomplete .create-adapter.json file missing fields with choices
		const incompleteAnswers = {
			cli: true,
			target: "directory",
			adapterName: "test-adapter",
			title: "Test Adapter",
			features: ["adapter"],
			authorName: "Test Author",
			authorGithub: "testauthor",
			authorEmail: "test@example.com",
		};

		const replayFile = path.join(testDir, ".create-adapter.json");
		await fs.writeJson(replayFile, incompleteAnswers);

		// Run the CLI in non-interactive mode
		try {
			execaSync("node", [binPath, `--replay=${replayFile}`, "--non-interactive", "--no-install"], {
				cwd: testDir,
				encoding: "utf8",
			});
			// Should not reach here
			expect.fail("Expected process to exit with error");
		} catch (error: any) {
			// Check that it exited with non-zero code
			expect(error.exitCode).to.equal(1);

			// Check that the error output contains expected messages
			const output = error.stdout + error.stderr;
			expect(output).to.include("ERROR: Missing required fields");
			// Should show allowed values for type field
			expect(output).to.include("Allowed values:");
			// Should mention the language field which has choices
			expect(output).to.include("Programming Language");
			expect(output).to.include("JavaScript");
			expect(output).to.include("TypeScript");
		}
	});

	it("should not prompt or hang when in non-interactive mode", async () => {
		// Create an incomplete .create-adapter.json file
		const incompleteAnswers = {
			cli: true,
			target: "directory",
			adapterName: "test-adapter",
			title: "Test Adapter",
		};

		const replayFile = path.join(testDir, ".create-adapter.json");
		await fs.writeJson(replayFile, incompleteAnswers);

		// Run the CLI in non-interactive mode with a timeout
		// If it prompts, it would hang and timeout
		const startTime = Date.now();
		try {
			execaSync("node", [binPath, `--replay=${replayFile}`, "--non-interactive", "--no-install"], {
				cwd: testDir,
				encoding: "utf8",
				timeout: 30000, // 30 second timeout
			});
			// Should not reach here
			expect.fail("Expected process to exit with error");
		} catch (error: any) {
			const duration = Date.now() - startTime;
			// Should complete quickly (within 10 seconds), not hang
			expect(duration).to.be.lessThan(10000);
			// Should exit with error code
			expect(error.exitCode).to.equal(1);
		}
	});
});
