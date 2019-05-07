import { readFileFromRootDir, TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	if (answers.icon) {
		if (typeof answers.icon === "string") {
			// Try to decode Base64
			const base64Match = answers.icon.match(/^data:image\/(\w+);base64,(.+)$/);
			if (base64Match) {
				return Buffer.from(base64Match[2], "base64");
			}
			throw new Error("The icon has an unsupported string encoding!");
		} else {
			// Return the raw buffer
			return answers.icon;
		}
	}

	// Fall back to reading the default image
	return readFileFromRootDir("../../adapter-creator.png", __dirname, true);
};
templateFunction.customPath = answers => `admin/${answers.adapterName}.png`;
templateFunction.noReformat = true; // Don't format binary files
export = templateFunction;
