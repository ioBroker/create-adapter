import type { TemplateFunction } from "../src/lib/createAdapter";
import { getFormattedLicense } from "../src/lib/tools";

export = (answers => {
	return getFormattedLicense(answers);
}) as TemplateFunction;
