import type { TemplateFunction } from "../../src/lib/createAdapter";
import { readFile } from "../../src/lib/createAdapter";

export = (answers => {
	const useESM = answers.moduleType === "esm";

	if (useESM) {
		return `import path from "path";
import { fileURLToPath } from "url";
import { tests } from "@iobroker/testing";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Validate the package files
tests.packageFiles(path.join(__dirname, ".."));
`;
	}

	return readFile("package.raw.js", __dirname);
}) as TemplateFunction;
