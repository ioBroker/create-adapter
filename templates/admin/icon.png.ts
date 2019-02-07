import { readFileFromRootDir, TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	if (answers.icon && typeof answers.icon === "string") {
		const m = answers.icon.match(/^data:image\/(\w+);base64,(.+)$/);
		if (m) {
			return new Buffer(m[2], "base64");
		}
	}
	return readFileFromRootDir("../../adapter-creator.png", __dirname, true);
};

templateFunction.customPath = answers => `admin/${answers.adapterName}.png`;
templateFunction.noReformat = true; // Don't format binary files
export = templateFunction;
