import type { TemplateFunction } from "../../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useReact = answers.adminReact === "yes";
	if (!useReact) return;

	const template = `
import React from "react";
import { ${useTypeScript ? "Theme, " : ""}withStyles } from "@material-ui/core/styles";

import GenericApp from "@iobroker/adapter-react/GenericApp";
import Settings from "./components/settings";
${useTypeScript ?
`import { GenericAppProps, GenericAppSettings } from "@iobroker/adapter-react/types";
import { StyleRules } from "@material-ui/core/styles";
` : ""}
${useTypeScript ?
`const styles = (_theme: Theme): StyleRules => ({
	root: {},
});` : `/**
 * @type {(_theme: Theme) => import("@material-ui/styles").StyleRules}
 */
const styles = (_theme) => ({
	root: {},
});`}

class App extends GenericApp {
	constructor(props${useTypeScript ? ": GenericAppProps" : ""}) {
		const extendedProps${useTypeScript ? ": GenericAppSettings" : ""} = {
			...props,
			encryptedFields: [],
			translations: {
				"en": require("./i18n/en.json"),
				"de": require("./i18n/de.json"),
				"ru": require("./i18n/ru.json"),
				"pt": require("./i18n/pt.json"),
				"nl": require("./i18n/nl.json"),
				"fr": require("./i18n/fr.json"),
				"it": require("./i18n/it.json"),
				"es": require("./i18n/es.json"),
				"pl": require("./i18n/pl.json"),
				"zh-cn": require("./i18n/zh-cn.json"),
			},
		};
		super(props, extendedProps);
	}

	onConnectionReady()${useTypeScript ? ": void" : ""} {
		// executed when connection is ready
	}

	render() {
		if (!this.state.loaded) {
			return super.render();
		}

		return (
			<div className="App">
				<Settings native={this.state.native} onChange={(attr, value) => this.updateNativeValue(attr, value)} />
				{this.renderError()}
				{this.renderToast()}
				{this.renderSaveCloseButtons()}
			</div>
		);
	}
}

export default withStyles(styles)(App);
`;
	return template.trim();};

templateFunction.customPath = (answers) => {
	const useTypeScript = answers.language === "TypeScript";
	return `admin/src/app.${useTypeScript ? "tsx" : "jsx"}`;
}
export = templateFunction;
