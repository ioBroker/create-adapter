import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useReact = answers.tabReact === "yes";
	if (!useReact) return;
	
	const template = `
import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "@iobroker/adapter-react/Theme";
import Utils from "@iobroker/adapter-react/Components/Utils";
import TabApp from "./tab-app";

let themeName = Utils.getThemeName();

function build()${useTypeScript ? ": void" : ""} {
	ReactDOM.render(
		<MuiThemeProvider theme={theme(themeName)}>
			<TabApp
				adapterName="${answers.adapterName}"
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

templateFunction.customPath = (answers) => {
	const useTypeScript = answers.language === "TypeScript";
	return `admin/src/tab.${useTypeScript ? "tsx" : "jsx"}`;
}
export = templateFunction;
