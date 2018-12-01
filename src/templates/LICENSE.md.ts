import { Answers } from "../lib/questions";
import { formatLicense } from "../lib/tools";

export = async (answers: Answers) => {
	return answers.license
		&& answers.license.text
		&& formatLicense(answers.license.text, answers)
		|| "TODO: enter license text here";
};
