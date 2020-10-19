import { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useReact = answers.adminReact === "yes";
	if (!(useTypeScript && useReact)) return;
	
	const template = `
import * as React from "react";
import * as ReactDOM from "react-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "@iobroker/adapter-react/Theme";
import Utils from "@iobroker/adapter-react/Components/Utils";
import App from "./app";

window["adapterName"] = ${JSON.stringify(answers.adapterName)};
let themeName = Utils.getThemeName();

function build(): void {
	ReactDOM.render(
		<MuiThemeProvider theme={theme(themeName)}>
			<App
				onThemeChange={(_theme) => {
					themeName = _theme;
					build();
				}}
			/>
		</MuiThemeProvider>,
		document.getElementById("root"),
	);
}

build();
`;
	return template.trim();
};

export = templateFunction;
