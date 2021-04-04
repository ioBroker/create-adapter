import {
	Answers,
	checkAnswers,
	formatAnswers,
	validateAnswers,
} from "./lib/core/questions";
import { createFiles, File } from "./lib/createAdapter";

export async function createAdapter(
	answers: Answers,
	disableValidation: (keyof Answers)[] = [],
): Promise<File[]> {
	// Check all answers
	checkAnswers(answers);
	answers = (await formatAnswers(answers)) as Answers;
	await validateAnswers(answers, disableValidation);

	// Create files
	return createFiles(answers);
}
