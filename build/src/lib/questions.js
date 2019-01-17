"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeguards_1 = require("alcalzone-shared/typeguards");
const ansi_colors_1 = require("ansi-colors");
const actionsAndTransformers_1 = require("./actionsAndTransformers");
const createAdapter_1 = require("./createAdapter");
const licenses_1 = require("./licenses");
const tools_1 = require("./tools");
function isQuestionGroup(val) {
    if (val == undefined)
        return false;
    if (typeof val.headline !== "string")
        return false;
    if (!typeguards_1.isArray(val.questions))
        return false;
    // For now we don't need any more specific tests
    return true;
}
exports.isQuestionGroup = isQuestionGroup;
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
/** All questions and the corresponding text lines */
exports.questionsAndText = [
    "",
    ansi_colors_1.green.bold("====================================================="),
    ansi_colors_1.green.bold(`   Welcome to the ioBroker adapter creator v${tools_1.getOwnVersion()}!`),
    ansi_colors_1.green.bold("====================================================="),
    "",
    ansi_colors_1.gray(`You can cancel at any point by pressing Ctrl+C.`),
    {
        headline: "Let's get started with a few questions about your project!",
        questions: [
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
        ],
    },
    {
        headline: "Nice! Let's get technical...",
        questions: [
            styledMultiselect({
                name: "features",
                message: "Which features should your project contain?",
                initial: [0],
                choices: [
                    { message: "Adapter", value: "adapter" },
                    { message: "Visualization", value: "vis" },
                ],
                action: actionsAndTransformers_1.checkMinSelections.bind(undefined, "feature", 1),
            }),
            {
                condition: { name: "features", contains: "adapter" },
                type: "select",
                name: "type",
                message: "Which category does your adapter fall into?",
                choices: [
                    { message: "Alarm / security         (Home, car, boat, ...)", value: "alarm" },
                    { message: "Calendars                (also schedules, etc. ...)", value: "date-and-time" },
                    { message: "Climate control          (A/C, Heaters, air filters, ...)", value: "climate-control" },
                    { message: "Communication protocols  (MQTT, ...)", value: "protocols" },
                    { message: "Data storage             (SQL/NoSQL, file storage, logging, ...)", value: "storage" },
                    { message: "Data transmission        (for other services via REST api, websockets, ...)", value: "communication" },
                    { message: "Garden                   (Mowers, watering, ...)", value: "garden" },
                    { message: "General purpose          (like admin, web, discovery, ...)", value: "general" },
                    { message: "Geo positioning          (transmission and receipt of position data)", value: "geoposition" },
                    { message: "Hardware                 (low-level, multi-purpose)", value: "hardware" },
                    { message: "Household devices        (Vacuums, kitchen, ...)", value: "household" },
                    { message: "Lighting control", value: "lighting" },
                    { message: "Logic                    (Scripts, rules, parsers, scenes, ...)", value: "logic" },
                    { message: "Messaging                (E-Mail, Telegram, WhatsApp, ...)", value: "messaging" },
                    { message: "Meters for energy, electricity, ...", value: "energy" },
                    { message: "Meters for water, gas, oil, ...", value: "metering" },
                    { message: "Miscellaneous data       (Import/export of contacts, gasoline prices, ...)", value: "misc-data" },
                    { message: "Miscellaneous utilities  (Data import/emport, backup, ...)", value: "utility" },
                    { message: "Multimedia               (TV, audio, remote controls, ...)", value: "multimedia" },
                    { message: "Network infrastructure   (Hardware, printers, phones, ...)", value: "infrastructure" },
                    { message: "Network utilities        (Ping, UPnP, network discovery, ...)", value: "network" },
                    { message: "Smart home systems       (3rd party, hardware and software)", value: "iot-systems" },
                    { message: "Visualizations           (VIS, MaterialUI, mobile views, ...)", value: "visualization" },
                    { message: "Weather                  (Forecast, air quality, statistics, ...)", value: "weather" },
                ],
            },
            {
                condition: { name: "features", doesNotContain: "adapter" },
                type: "select",
                name: "type",
                message: "Which kind of visualization is this?",
                choices: [
                    { message: "Icons for VIS", value: "visualization-icons" },
                    { message: "VIS widgets", value: "visualization-widgets" },
                ],
            },
            {
                condition: { name: "features", contains: "adapter" },
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
                condition: { name: "features", contains: "adapter" },
                type: "select",
                name: "language",
                message: "Which language do you want to use to code the adapter?",
                choices: [
                    "JavaScript",
                    "TypeScript",
                ],
            },
            // {
            // 	condition: { name: "language", value: "JavaScript" },
            // 	type: "select",
            // 	name: "ecmaVersion",
            // 	message: `Do you need async functions or String.pad{Start,End}`,
            // 	choices: [
            // 		{ message: "yes", value: 8 },
            // 		{ message: "no", value: 6 },
            // 	],
            // },
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
            // 		{ name: "features", contains: "adapter" },
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
            // 	condition: { name: "features", contains: "adapter" },
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
                condition: { name: "features", contains: "adapter" },
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
                condition: { name: "features", contains: "adapter" },
                type: "select",
                name: "quotes",
                message: "Do you prefer double or single quotes?",
                initial: "double",
                choices: [
                    "double",
                    "single",
                ],
            },
        ],
    },
    {
        headline: "Almost done! Just a few administrative details...",
        questions: [
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
        ],
    },
    "",
    ansi_colors_1.underline("That's it. Please wait a minute while I get this working..."),
];
/** Only the questions */
exports.questions = exports.questionsAndText.filter(q => typeof q !== "string")
    .map(q => isQuestionGroup(q) ? q.questions : [q])
    .reduce((arr, next) => arr.concat(...next), []);
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
