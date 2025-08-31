import { readdir, readFile } from "fs-extra";
import { join, resolve } from "path";

const testAllFiles = async (
	assertion: (content: string, filename: string) => void,
) => {
	const baseDir = resolve(__dirname, "./core");
	const files = await readdir(baseDir);
	for (const file of files.filter(
		(f) => f.endsWith(".ts") && !f.endsWith(".test.ts"),
	)) {
		const content = await readFile(join(baseDir, file), {
			encoding: "utf8",
		});
		assertion(content, file);
	}
};

/**
 * These tests are used to ensure that everything in the ./core directory
 * can be included from React. Please be careful when modifying them!
 */
describe("./core directory", () => {
	it("should not contain any imports from base directory (../)", async () => {
		testAllFiles((content, file) =>
			content.should.not.match(
				/import .+ from "\.\./gi,
				`${file} contains an import from the base directory`,
			),
		);
	});

	it('should not contain any imports from "os"', async () => {
		await testAllFiles((content, file) =>
			content.should.not.match(
				/import .+ from "os";/gi,
				`${file} contains an import from "os"`,
			),
		);
	});

	it('should not contain any imports from "fs"', async () => {
		await testAllFiles((content, file) =>
			content.should.not.match(
				/import .+ from "fs";/gi,
				`${file} contains an import from "fs"`,
			),
		);
	});

	it('should not contain any imports from "fs-extra"', async () => {
		await testAllFiles((content, file) =>
			content.should.not.match(
				/import .+ from "fs-extra";/gi,
				`${file} contains an import from "fs-extra"`,
			),
		);
	});

	it('should not contain any imports from "path"', async () => {
		await testAllFiles((content, file) =>
			content.should.not.match(
				/import .+ from "path";/gi,
				`${file} contains an import from "path"`,
			),
		);
	});
});
