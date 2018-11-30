"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const actionsAndTransformers_1 = require("./actionsAndTransformers");
function styledMultiselect(ms) {
    return Object.assign({}, ms, {
        type: "multiselect",
        hint: "(Use <space> to select, <return> to submit)",
        symbols: {
            indicator: {
                on: ansi_colors_1.green("■"),
                off: ansi_colors_1.dim.gray("□"),
            },
        },
    });
}
const features = [
    { nodeVersion: 8, message: "String.pad{Start,End}" },
    { nodeVersion: 8, message: "async/await" },
    { nodeVersion: 10, message: "Promise.finally" },
    { nodeVersion: 10, message: "String.trim{Start,End}" },
    { nodeVersion: 10.8, message: "bigint" },
    { nodeVersion: 11, message: "Array.flat[Map]" },
];
exports.questions = [
    ansi_colors_1.bold("Welcome to the ioBroker adapter creator!"),
    "",
    "Let's get started with a few questions about your project!",
    {
        type: "input",
        name: "adapterName",
        message: "Please enter the name of your project:",
        resultTransform: actionsAndTransformers_1.transformAdapterName,
        action: actionsAndTransformers_1.checkAdapterExistence,
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
            { message: "Code coverage" },
        ],
    }),
    styledMultiselect({
        condition: { name: "features", contains: "Adapter" },
        name: "nodeVersion",
        message: "Which of the following language features do you need?",
        initial: [0, 1, 2, 3],
        choices: features.map(f => f.message),
        resultTransform: (selectedFeatures) => {
            const nodeVersions = selectedFeatures.map(f => features.find(ff => ff.message === f).nodeVersion);
            return Math.max(...nodeVersions);
        },
    }),
    {
        condition: { name: "features", contains: "Adapter" },
        type: "select",
        name: "adminReact",
        message: "Use React for the Admin UI?",
        initial: "no",
        choices: ["yes", "no"],
    },
    {
        condition: { name: "features", contains: "Adapter" },
        type: "select",
        name: "adminTab",
        message: "Create a tab in the admin UI?",
        initial: "no",
        choices: ["yes", "no"],
    },
    {
        condition: { name: "admin-tab", value: "yes" },
        type: "select",
        name: "tabReact",
        message: "Use React for the tab?",
        initial: "no",
        choices: ["yes", "no"],
    },
    "",
    ansi_colors_1.bold("Almost done! Just a few administrative details..."),
    {
        type: "input",
        name: "authorName",
        message: "Please enter your name:",
        action: actionsAndTransformers_1.checkAuthorName,
    },
    {
        type: "input",
        name: "authorGithub",
        message: "What's your name/org on GitHub?",
        initial: (answers) => answers["author-name"],
        action: actionsAndTransformers_1.checkAuthorName,
    },
    {
        type: "input",
        name: "authorEmail",
        message: "What's your email address?",
        action: actionsAndTransformers_1.checkEmail,
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
    },
];
//# sourceMappingURL=questions.js.map