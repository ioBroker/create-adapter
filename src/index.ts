import type { Answers } from "./lib/core/questions";
import {
	checkAnswers,
	formatAnswers,
	validateAnswers,
} from "./lib/core/questions";
import type { File } from "./lib/createAdapter";
import { createFiles } from "./lib/createAdapter";

export async function createAdapter(
	answers: Answers,
	disableValidation: (keyof Answers)[] = [],
): Promise<File[]> {
	// Format answers (apply defaults, transformations, etc.)
	answers = (await formatAnswers(answers)) as Answers;
	// Check all answers
	checkAnswers(answers);
	await validateAnswers(answers, disableValidation);

	// Create files
	return createFiles(answers);
}
