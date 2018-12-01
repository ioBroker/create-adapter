import { Answers } from "../lib/questions";

export = async (answers: Answers) => {
	return answers.licenseText || "TODO: enter license text here";
};
