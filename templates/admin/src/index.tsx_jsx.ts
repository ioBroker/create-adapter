import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useReact = answers.adminUi === "react";
	if (!useReact) return;
	
	const template = `
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import theme from "@iobroker/adapter-react-v5/Theme";
import Utils from "@iobroker/adapter-react-v5/Components/Utils";
import App from "./app";

let themeName = Utils.getThemeName();

function build(${useTypeScript ? "this: any" : ""})${useTypeScript ? ": void" : ""} {
	ReactDOM.render(
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme(themeName)}>
				<App
					adapterName="${answers.adapterName}"
					onThemeChange={(_theme) => {
						themeName = _theme;
						build();
					}}
				/>
			</ThemeProvider>
		</StyledEngineProvider>,
		document.getElementById("root"),
	);
}

build();
`;
	return template.trim();
};

templateFunction.customPath = (answers) => {
	const useTypeScript = answers.language === "TypeScript";
	return `admin/src/index.${useTypeScript ? "tsx" : "jsx"}`;
}
export = templateFunction;
