import * as React from "react";
import { Theme, withStyles } from "@material-ui/core/styles";

import GenericApp from "@iobroker/adapter-react/GenericApp";
import Settings from "./components/settings";
import { GenericAppProps, GenericAppSettings } from "@iobroker/adapter-react/types";
import { StyleRules } from "@material-ui/styles";

const styles = (_theme: Theme): StyleRules => ({
	root: {},
});

class App extends GenericApp {
	constructor(props: GenericAppProps) {
		const extendedProps: GenericAppSettings = { ...props };
		extendedProps.encryptedFields = [];
		extendedProps.translations = {
			"en": require("./i18n/en"),
			"de": require("./i18n/de"),
			"ru": require("./i18n/ru"),
			"pt": require("./i18n/pt"),
			"nl": require("./i18n/nl"),
			"fr": require("./i18n/fr"),
			"it": require("./i18n/it"),
			"es": require("./i18n/es"),
			"pl": require("./i18n/pl"),
			"zh-cn": require("./i18n/zh-cn"),
		};

		super(props, extendedProps);
	}

	onConnectionReady(): void {
		// executed when connection is ready
	}

	render(): React.ReactNode {
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
