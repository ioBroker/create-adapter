// tslint:disable:no-var-requires

// tslint:disable-next-line:variable-name
import { prompt } from "enquirer";

// Sadly, Enquirer does not export the PromptOptions type
// tslint:disable-next-line:ban-types
type PromptOptions = Exclude<Parameters<typeof prompt>[0], Function | any[]>;
type QuestionAction<T> = (value: T) => Promise<boolean>;
interface QuestionMeta {
	condition?: {name: string, value: string | boolean | number};
	action?: QuestionAction<string | boolean | number>;
}
type Question = PromptOptions & QuestionMeta;

const questions: Question[] = [
	{
		type: "select",
		name: "language",
		message: "Mit welcher Sprache soll der Adapter programmiert werden?",
		choices: [
			"JavaScript",
			"TypeScript",
		],
	},
	{
		type: "confirm",
		name: "really",
		message: "Wirklich?",
		condition: {name: "language", value: "JavaScript"},
		action: (val: boolean) => {
			if (val) {
				console.log("Du bist unbelehrbar!");
			} else {
				console.log("gut so!");
			}
			return Promise.resolve(!val);
		},
	},
];

async function main() {
	let answers: Record<string, any> = {};
	for (const q of questions) {
		if (q.condition == undefined || answers[q.condition.name] === q.condition.value) {
			const answer: Record<string, any> = await prompt([q]);
			if (q.action && !await q.action(answer[q.name as string])) {
				process.exit(1);
			}
			answers = {...answers, ...answer};
		}
	}
	console.dir(answers);
}
main().catch(console.error);
