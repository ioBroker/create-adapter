import type { TemplateFunction } from "../../src/lib/createAdapter";
import { readFile } from "../../src/lib/createAdapter";

export = (_answers => {
	return readFile("package.raw.js", __dirname);
}) as TemplateFunction;
