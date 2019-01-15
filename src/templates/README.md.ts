import { TemplateFunction } from "../lib/createAdapter";
import { formatLicense } from "../lib/tools";

export = (answers => {

	const template = `
<h1>
  <img src="https://github.com/${answers.authorGithub}/ioBroker.${answers.adapterName}/blob/master/admin/${answers.adapterName}.png" width="64"/>
  ioBroker.${answers.adapterName}
</h1>

[![NPM version](http://img.shields.io/npm/v/iobroker.${answers.adapterName.toLowerCase()}.svg)](https://www.npmjs.com/package/iobroker.${answers.adapterName.toLowerCase()})
[![Downloads](https://img.shields.io/npm/dm/iobroker.${answers.adapterName.toLowerCase()}.svg)](https://www.npmjs.com/package/iobroker.${answers.adapterName.toLowerCase()})
[![Dependency Status](https://img.shields.io/david/${answers.authorGithub}/iobroker.${answers.adapterName.toLowerCase()}.svg)](https://david-dm.org/${answers.authorGithub}/iobroker.${answers.adapterName.toLowerCase()})
[![Known Vulnerabilities](https://snyk.io/test/github/${answers.authorGithub}/ioBroker.${answers.adapterName}/badge.svg)](https://snyk.io/test/github/${answers.authorGithub}/ioBroker.${answers.adapterName})

[![NPM](https://nodei.co/npm/iobroker.${answers.adapterName.toLowerCase()}.png?downloads=true)](https://nodei.co/npm/iobroker.${answers.adapterName.toLowerCase()}/)

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
