import type { Answers } from "./lib/core/questions";
import { checkAnswers, formatAnswers, validateAnswers } from "./lib/core/questions";
import type { File } from "./lib/createAdapter";
import { createFiles } from "./lib/createAdapter";

/**
 *
 * @param answers
 * @param disableValidation
 */
export async function createAdapter(answers: Answers, disableValidation: (keyof Answers)[] = []): Promise<File[]> {
	// Check all answers
	checkAnswers(answers);
	answers = (await formatAnswers(answers)) as Answers;
	await validateAnswers(answers, disableValidation);

	// Create files
	return createFiles(answers);
}
