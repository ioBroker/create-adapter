import React from "react";
import { Theme, withStyles } from "@material-ui/core/styles";

import GenericApp from "@iobroker/adapter-react/GenericApp";
import { GenericAppProps, GenericAppSettings } from "@iobroker/adapter-react/types";
import { StyleRules } from "@material-ui/core/styles";

const styles = (_theme: Theme): StyleRules => ({
	root: {},
});

class TabApp extends GenericApp {
	constructor(props: GenericAppProps) {
		const extendedProps: GenericAppSettings = {
			...props,
			bottomButtons: false,
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
				"uk": require("./i18n/uk.json"),
				"zh-cn": require("./i18n/zh-cn.json"),
			},
		};
		super(props, extendedProps);
	}

	onConnectionReady(): void {
		// executed when connection is ready
	}

	render() {
		if (!this.state.loaded) {
			return super.render();
		}

		return (
			<div className="App">
				Add your components here.
				{this.renderError()}
				{this.renderToast()}
			</div>
		);
	}
}

export default withStyles(styles)(TabApp);