"use strict";
const tools_1 = require("../lib/tools");
module.exports = (answers) => {
    const template = `
# ioBroker.${answers.adapterName}

${answers.description || "Describe your project here"}

## Changelog

### 0.0.1
* (${answers.authorName}) initial release

## License
${answers.license
        && answers.license.text
        && tools_1.formatLicense(answers.license.text, answers)
        || "TODO: enter license text here"}
`;
    return template.trim();
};
