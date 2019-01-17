import { readFile, TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = () => readFile("../../adapter-creator.png", __dirname, true);
templateFunction.customPath = answers => `admin/${answers.adapterName}.png`;
templateFunction.noReformat = true; // Don't format binary files
export = templateFunction;
