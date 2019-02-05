import { TemplateFunction } from "../src/lib/createAdapter";
import { formatLicense } from "../src/lib/tools";

export = (answers => {

	const adapterNameLowerCase = answers.adapterName.toLowerCase();
	const template = `
<h1>
	<img src="admin/${answers.adapterName}.png" width="64"/>
	ioBroker.${answers.adapterName}
</h1>

[![NPM version](http://img.shields.io/npm/v/iobroker.${adapterNameLowerCase}.svg)](https://www.npmjs.com/package/iobroker.${adapterNameLowerCase})
[![Downloads](https://img.shields.io/npm/dm/iobroker.${adapterNameLowerCase}.svg)](https://www.npmjs.com/package/iobroker.${adapterNameLowerCase})
[![Dependency Status](https://img.shields.io/david/${answers.authorGithub}/iobroker.${adapterNameLowerCase}.svg)](https://david-dm.org/${answers.authorGithub}/iobroker.${adapterNameLowerCase})
[![Known Vulnerabilities](https://snyk.io/test/github/${answers.authorGithub}/ioBroker.${answers.adapterName}/badge.svg)](https://snyk.io/test/github/${answers.authorGithub}/ioBroker.${answers.adapterName})

[![NPM](https://nodei.co/npm/iobroker.${adapterNameLowerCase}.png?downloads=true)](https://nodei.co/npm/iobroker.${adapterNameLowerCase}/)

**Tests:** Linux/Mac: [![Travis-CI](http://img.shields.io/travis/${answers.authorGithub}/ioBroker.${answers.adapterName}/master.svg)](https://travis-ci.org/${answers.authorGithub}/ioBroker.${answers.adapterName})
Windows: [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/${answers.authorGithub}/ioBroker.${answers.adapterName}?branch=master&svg=true)](https://ci.appveyor.com/project/${answers.authorGithub}/ioBroker-${answers.adapterName}/)

## ${answers.adapterName} adapter for ioBroker

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
