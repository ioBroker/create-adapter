import { TemplateFunction } from "../lib/createAdapter";
import { Answers } from "../lib/questions";
import { formatLicense } from "../lib/tools";

export = (answers => {

	const template = `
# ioBroker.${answers.adapterName}

${answers.description || "Describe your project here"}

## Changelog

### 0.0.1
* (${answers.authorName}) initial release

## License
${answers.license
	&& answers.license.text
	&& formatLicense(answers.license.text, answers)
	|| "TODO: enter license text here"}
`;
	return template.trim();
}) as TemplateFunction;
