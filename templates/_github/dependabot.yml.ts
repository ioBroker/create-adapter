import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {
	const useDependabot = answers.dependabot === "yes";
	if (!useDependabot) {
		return;
	}

	// Generate a consistent random day between 2 and 28 based on adapter name
	// This ensures all dependabot runs within a repository use the same day
	const hash = answers.adapterName.split("").reduce((acc, char) => {
		return (acc << 5) - acc + char.charCodeAt(0);
	}, 0);
	const dayOfMonth = Math.abs(hash % 27) + 2; // Range: 2-28

	const template = `
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: monthly
      day: ${dayOfMonth}
      time: "00:05"
      timezone: Europe/Berlin
    open-pull-requests-limit: 5
    assignees:
      - ${answers.authorGithub}
    versioning-strategy: increase

  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: monthly
      day: ${dayOfMonth}
      time: "00:05"
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
