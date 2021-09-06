import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	if (!isAdapter) return;

	const isScheduleAdapter = answers.startMode === "schedule";

	const template = `
const path = require("path");
const { tests } = require("@iobroker/testing");

// Run integration tests - See https://github.com/ioBroker/testing for a detailed explanation and further options${
	isScheduleAdapter ? (`
tests.integration(path.join(__dirname, ".."), {
	allowedExitCodes: [11],
});
	`) : (`
tests.integration(path.join(__dirname, ".."));
	`)}
`;
	return template.trim();
};

export = templateFunction;
