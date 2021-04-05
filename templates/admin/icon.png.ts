import { getIconName } from "../../src/lib/core/questions";
import { readFileFromRootDir, TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	if (answers.icon) {
		if (typeof answers.icon.data === "string") {
			// Try to decode Base64
			const base64Match = answers.icon.data.match(/^data:image\/([^;]+);base64,(.+)$/);
			if (base64Match) {
				return Buffer.from(base64Match[2], "base64");
			}
			throw new Error("The icon has an unsupported string encoding!");
		} else {
			// Return the raw buffer
			return answers.icon.data;
		}
	}

	// Fall back to reading the default image
	return readFileFromRootDir("../../adapter-creator.png", __dirname, true);
};
templateFunction.customPath = answers => `admin/${getIconName(answers)}`;
templateFunction.noReformat = true; // Don't format binary files
export = templateFunction;
