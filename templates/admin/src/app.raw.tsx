import * as React from "react";
import { withStyles } from "@material-ui/core/styles";

import GenericApp from "@iobroker/adapter-react/GenericApp";
import Settings from "./components/settings";
import { GenericAppProps, GenericAppSettings } from "@iobroker/adapter-react/types";

const styles = (theme) => ({
	root: {},
});

class App extends GenericApp {
	constructor(props: GenericAppProps) {
		const extendedProps: GenericAppSettings = { ...props };
		extendedProps.encryptedFields = [];
		extendedProps.translations = {};
		for (const key in systemDictionary) {
			for (const lang in systemDictionary[key]) {
				if (!extendedProps.translations[lang]) {
					extendedProps.translations[lang] = {};
				}
				extendedProps.translations[lang][key] = systemDictionary[key][lang];
			}
		}

		super(props, extendedProps);
	}

	onConnectionReady() {
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
