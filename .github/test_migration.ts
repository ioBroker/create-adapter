/**
 * Migration Testing Script
 *
 * This script tests the adapter creation/migration functionality by:
 * 1. Cloning the ioBroker.example repository (contains reference adapters)
 * 2. For each adapter variant, reading its .create-adapter.json file
 * 3. Recreating the adapter using the programmatic API with those answers
 * 4. Verifying that the recreated adapter can build and lint successfully
 *
 * This ensures that the adapter creator remains compatible with previously
 * generated adapters and that the migration/replay feature works correctly.
 */

import { blue, green, red } from "ansi-colors";
import type { ExecSyncOptions } from "child_process";
import { execSync } from "child_process";
import * as fs from "fs-extra";
import * as path from "path";
import { createAdapter } from "../src";
import type { Answers } from "../src/lib/core/questions";
import { writeFiles } from "../src/lib/createAdapter";

const exampleRepoUrl = "https://github.com/ioBroker/ioBroker.example";
const workDir = process.cwd();
const exampleDir = path.join(workDir, "ioBroker.example");
const migrationTestDir = path.join(workDir, "migration-test-output");

interface TestResult {
	variant: string;
	passed: boolean;
	error?: string;
	stage?: string;
}

async function cloneExampleRepo(): Promise<void> {
	console.log(green("Cloning ioBroker.example repository..."));
	console.log(green("========================================"));
	
	// Remove old clone if it exists
	if (await fs.pathExists(exampleDir)) {
		await fs.remove(exampleDir);
	}
	
	execSync(`git clone --depth 1 ${exampleRepoUrl}`, {
		cwd: workDir,
		stdio: "inherit",
	});
}

async function getVariants(): Promise<string[]> {
	const entries = await fs.readdir(exampleDir, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
		.map((entry) => entry.name)
		.sort();
}

async function testVariant(variantName: string): Promise<TestResult> {
	const result: TestResult = {
		variant: variantName,
		passed: false,
	};

	try {
		const variantPath = path.join(exampleDir, variantName);
		const outputPath = path.join(migrationTestDir, variantName);

		console.log(blue(`Testing: ${variantName}`));

		// Read the .create-adapter.json file
		const createAdapterJsonPath = path.join(
			variantPath,
			".create-adapter.json",
		);

		if (!(await fs.pathExists(createAdapterJsonPath))) {
			result.error = "No .create-adapter.json found";
			result.stage = "pre-check";
			return result;
		}

		const answers = (await fs.readJSON(
			createAdapterJsonPath,
		)) as Answers;

		// Clean output directory
		if (await fs.pathExists(outputPath)) {
			await fs.remove(outputPath);
		}
		await fs.ensureDir(outputPath);

		console.log("  Recreating adapter from answers...");
		result.stage = "create";

		// Create the adapter using the answers
		const files = await createAdapter(answers, ["adapterName", "title"]);
		await writeFiles(outputPath, files);

		console.log("  Installing dependencies...");
		result.stage = "install";

		const cmdOpts: ExecSyncOptions = {
			cwd: outputPath,
			stdio: "pipe",
		};

		execSync("npm install --loglevel error --no-audit", cmdOpts);

		// Check if lint script exists
		const packageJson = await fs.readJSON(
			path.join(outputPath, "package.json"),
		);

		if (packageJson.scripts?.lint) {
			console.log("  Running lint...");
			result.stage = "lint";
			execSync("npm run lint", cmdOpts);
		} else {
			console.log("  No lint script found, skipping...");
		}

		// Check if build script exists
		if (packageJson.scripts?.build) {
			console.log("  Running build...");
			result.stage = "build";
			try {
				execSync("npm run build", cmdOpts);
			} catch (error) {
				// Capture stderr to show the actual error
				const stderr = error.stderr?.toString() || "";
				const stdout = error.stdout?.toString() || "";
				throw new Error(
					`Build failed:\n${stdout}\n${stderr}`.trim(),
				);
			}
		} else {
			console.log("  No build script found, skipping...");
		}

		console.log(green(`  ✓ ${variantName} passed`));
		result.passed = true;
	} catch (error) {
		result.error =
			error instanceof Error ? error.message : String(error);
		console.error(red(`  ✗ ${variantName} failed at ${result.stage}`));
		if (result.error) {
			console.error(red(`    Error: ${result.error}`));
		}
	}

	return result;
}

async function cleanup(): Promise<void> {
	console.log();
	console.log(green("Cleaning up..."));
	console.log(green("=============="));

	// Remove example repository
	if (await fs.pathExists(exampleDir)) {
		await fs.remove(exampleDir);
		console.log("Removed ioBroker.example");
	}

	// Remove migration test output
	if (await fs.pathExists(migrationTestDir)) {
		await fs.remove(migrationTestDir);
		console.log("Removed migration test output");
	}
}

(async () => {
	try {
		console.log();
		console.log(green("==========================================="));
		console.log(green("  ioBroker Adapter Migration Test Suite"));
		console.log(green("==========================================="));
		console.log();

		// Clone the example repository
		await cloneExampleRepo();

		// Get all variants
		const variants = await getVariants();
		console.log();
		console.log(green("Found adapter variants:"));
		variants.forEach((v) => console.log(`  - ${v}`));
		console.log();

		// Test each variant
		console.log(green("Testing variants"));
		console.log(green("================"));
		console.log();

		const results: TestResult[] = [];
		for (let i = 0; i < variants.length; i++) {
			const variant = variants[i];
			console.log(
				blue(`[${i + 1}/${variants.length}] Testing ${variant}`),
			);
			const result = await testVariant(variant);
			results.push(result);
			console.log();
		}

		// Clean up
		await cleanup();

		// Print summary
		console.log();
		console.log(green("==========================================="));
		console.log(green("  Test Summary"));
		console.log(green("==========================================="));
		console.log();

		const passed = results.filter((r) => r.passed).length;
		const failed = results.filter((r) => !r.passed).length;

		console.log(`Total:  ${results.length}`);
		console.log(`Passed: ${green(String(passed))}`);
		console.log(`Failed: ${failed > 0 ? red(String(failed)) : "0"}`);

		if (failed > 0) {
			console.log();
			console.log(red("Failed variants:"));
			results
				.filter((r) => !r.passed)
				.forEach((r) => {
					console.log(
						red(
							`  - ${r.variant} (${r.stage || "unknown"}): ${r.error || "Unknown error"}`,
						),
					);
				});

			console.log();
			console.error(red("Some migration tests failed!"));
			process.exit(1);
		}

		console.log();
		console.log(green("All migration tests passed! ✓"));
	} catch (error) {
		console.error(red("Fatal error during migration testing:"));
		console.error(error);
		process.exit(1);
	}
})();

// Make sure errors fail the build
process.on("unhandledRejection", (e) => {
	throw e;
});
