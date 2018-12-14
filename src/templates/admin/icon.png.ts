import * as fs from "fs-extra";
import * as path from "path";
import { TemplateFunction } from "../../lib/createAdapter";

const templateFunction: TemplateFunction = () => fs.readFile(path.join(__dirname, "../../../adapter-creator.png"));

templateFunction.customPath = answers => `admin/${answers.adapterName}.png`;
templateFunction.noReformat = true; // Don't format binary files
export = templateFunction;
