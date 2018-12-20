"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const actionsAndTransformers_1 = require("./actionsAndTransformers");
const createAdapter_1 = require("./createAdapter");
const licenses_1 = require("./licenses");
function styledMultiselect(ms) {
    return Object.assign({}, ms, {
        type: "multiselect",
        hint: ansi_colors_1.gray("(<space> to select, <return> to submit)"),
        symbols: {
            indicator: {
                on: ansi_colors_1.green("■"),
                off: ansi_colors_1.dim.gray("□"),
            },
        },
    });
}
// tslint:disable-next-line:no-var-requires
const ownVersion = require("../../package.json").version;
/** All questions and the corresponding text lines */
exports.questionsAndText = [
    "",
    ansi_colors_1.green.bold("====================================================="),
    ansi_colors_1.green.bold(`   Welcome to the ioBroker adapter creator v${ownVersion}!`),
    ansi_colors_1.green.bold("====================================================="),
    "",
    ansi_colors_1.gray(`You can cancel at any point by pressing Ctrl+C.`),
    "",
    ansi_colors_1.underline("Let's get started with a few questions about your project!"),
    {
        type: "input",
        name: "adapterName",
        message: "Please enter the name of your project:",
        resultTransform: actionsAndTransformers_1.transformAdapterName,
        action: actionsAndTransformers_1.checkAdapterName,
    },
    {
        type: "input",
        name: "title",
        message: "Which title should be shown in the admin UI?",
        action: actionsAndTransformers_1.checkTitle,
    },
    {
        type: "input",
        name: "description",
        message: "Please enter a short description:",
        hint: "(optional)",
        optional: true,
        resultTransform: actionsAndTransformers_1.transformDescription,
    },
    styledMultiselect({
        name: "features",
        message: "Which features should your project contain?",
        initial: [0],
        choices: [
            "Adapter",
            "VIS widget",
        ],
        action: actionsAndTransformers_1.checkMinSelections.bind(undefined, "feature", 1),
    }),
    {
        condition: { name: "features", contains: "Adapter" },
        type: "select",
        name: "startMode",
        message: "When should the adapter be started?",
        initial: "daemon",
        choices: [
            { message: "always", hint: ansi_colors_1.dim.gray("(recommended for most adapters)"), value: "daemon" },
            { message: `when the ".alive" state is true`, value: "subscribe" },
            { message: "depending on a schedule", value: "schedule" },
            { message: "when the instance object changes", value: "once" },
            { message: "never", value: "none" },
        ],
    },
    {
        condition: { name: "features", contains: "Adapter" },
        type: "select",
        name: "language",
        message: "Which language do you want to use to code the adapter?",
        choices: [
            "JavaScript",
            "TypeScript",
        ],
    },
    styledMultiselect({
        condition: { name: "language", value: "JavaScript" },
        name: "tools",
        message: "Which of the following tools do you want to use?",
        initial: [0, 1],
        choices: [
            { message: "ESLint", hint: "(recommended)" },
            { message: "type checking", hint: "(recommended)" },
        ],
    }),
    styledMultiselect({
        condition: { name: "language", value: "TypeScript" },
        name: "tools",
        message: "Which of the following tools do you want to use?",
        initial: [0],
        choices: [
            { message: "TSLint", hint: "(recommended)" },
            { message: "code coverage" },
        ],
    }),
    // TODO: enable React (only TypeScript at the start)
    // {
    // 	condition: [
    // 		{ name: "features", contains: "Adapter" },
    // 		{ name: "language", value: "TypeScript" }, // TODO: enable React for JS through Babel
    // 	],
    // 	type: "select",
    // 	name: "adminReact",
    // 	message: "Use React for the Admin UI?",
    // 	initial: "no",
    // 	choices: ["yes", "no"],
    // },
    // TODO: support admin tab
    // {
    // 	condition: { name: "features", contains: "Adapter" },
    // 	type: "select",
    // 	name: "adminTab",
    // 	message: "Create a tab in the admin UI?",
    // 	initial: "no",
    // 	choices: ["yes", "no"],
    // },
    // {
    // 	condition: { name: "adminTab", value: "yes" },
    // 	type: "select",
    // 	name: "tabReact",
    // 	message: "Use React for the tab?",
    // 	initial: "no",
    // 	choices: ["yes", "no"],
    // },
    {
        condition: { name: "features", contains: "Adapter" },
        type: "select",
        name: "indentation",
        message: "Do you prefer tab or space indentation?",
        initial: "Tab",
        choices: [
            "Tab",
            "Space (4)",
        ],
    },
    {
        condition: [
            { name: "features", contains: "Adapter" },
            { name: "language", value: "JavaScript" },
        ],
        type: "select",
        name: "quotes",
        message: "Do you prefer double or single quotes?",
        initial: "double",
        choices: [
            "double",
            "single",
        ],
    },
    "",
    ansi_colors_1.underline("Almost done! Just a few administrative details..."),
    {
        type: "input",
        name: "authorName",
        message: "Please enter your name (or nickname):",
        action: actionsAndTransformers_1.checkAuthorName,
    },
    {
        type: "input",
        name: "authorGithub",
        message: "What's your name/org on GitHub?",
        initial: (answers) => answers.authorName,
        action: actionsAndTransformers_1.checkAuthorName,
    },
    {
        type: "input",
        name: "authorEmail",
        message: "What's your email address?",
        action: actionsAndTransformers_1.checkEmail,
    },
    {
        condition: { name: "cli", value: true },
        type: "select",
        name: "gitCommit",
        message: "Initialize the GitHub repo automatically?",
        initial: "no",
        choices: ["yes", "no"],
    },
    {
        type: "select",
        name: "license",
        message: "Which license should be used for your project?",
        initial: 5,
        choices: [
            "GNU AGPLv3",
            "GNU GPLv3",
            "GNU LGPLv3",
            "Mozilla Public License 2.0",
            "Apache License 2.0",
            "MIT License",
            "The Unlicense",
        ],
        resultTransform: (value) => licenses_1.licenses[value],
    },
    "",
    ansi_colors_1.underline("That's it. Please wait a minute while I get this working..."),
];
/** Only the questions */
exports.questions = exports.questionsAndText.filter(q => typeof q !== "string");
function checkAnswers(answers) {
    for (const q of exports.questions) {
        const answer = answers[q.name];
        const conditionFulfilled = createAdapter_1.testCondition(q.condition, answers);
        if (!q.optional && conditionFulfilled && answer == undefined) {
            // A required answer was not given
            throw new Error(`Missing answer "${q.name}"!`);
        }
        else if (!conditionFulfilled && answer != undefined) {
            // TODO: Find a fool-proof way to check for extraneous answers
            if (exports.questions.filter(qq => qq.name === q.name).length > 0) {
                // For now, don't enforce conditions for questions with multiple branches
                continue;
            }
            // An extraneous answer was given
            throw new Error(`Extraneous answer "${q.name}" given!`);
        }
    }
}
exports.checkAnswers = checkAnswers;
async function formatAnswers(answers) {
    for (const q of exports.questions) {
        const conditionFulfilled = createAdapter_1.testCondition(q.condition, answers);
        if (!conditionFulfilled)
            continue;
        // Apply an optional transformation
        if (answers[q.name] != undefined && typeof q.resultTransform === "function") {
            const transformed = q.resultTransform(answers[q.name]);
            answers[q.name] = transformed instanceof Promise ? await transformed : transformed;
        }
    }
    return answers;
}
exports.formatAnswers = formatAnswers;
async function validateAnswers(answers) {
    for (const q of exports.questions) {
        const conditionFulfilled = createAdapter_1.testCondition(q.condition, answers);
        if (!conditionFulfilled)
            continue;
        if (q.action == undefined)
            continue;
        const testResult = await q.action(answers[q.name]);
        if (typeof testResult === "string") {
            throw new Error(testResult);
        }
    }
}
exports.validateAnswers = validateAnswers;
