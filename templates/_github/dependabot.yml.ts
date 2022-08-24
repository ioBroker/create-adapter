import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useDependabot = answers.dependabot === "yes";
	if (!useDependabot) return;

	const template = `
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: monthly
      time: "04:00"
      timezone: Europe/Berlin
    open-pull-requests-limit: 5
    assignees:
      - ${answers.authorGithub}
    versioning-strategy: increase

  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: monthly
      time: "04:00"
      timezone: Europe/Berlin
    open-pull-requests-limit: 5
    assignees:
      - ${answers.authorGithub}
`;
	return template.trimLeft();
};

templateFunction.customPath = ".github/dependabot.yml";
// Reformatting this would create mixed tabs and spaces
templateFunction.noReformat = true;
export = templateFunction;
