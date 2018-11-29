// tslint:disable:no-var-requires

// tslint:disable-next-line:variable-name
import { prompt } from "enquirer";

async function main() {
	const language = await prompt([{
		type: "select",
		name: "language",
		message: "Mit welcher Sprache soll der Adapter programmiert werden?",
		choices: [
			"JavaScript",
			"TypeScript",
		],
	}]);
	console.dir(language);
}
main().catch(console.error);
