import * as React from "react";
import * as ReactDOM from "react-dom";

import { OnSettingsChangedCallback, Settings } from "./components/settings";
import {
	subscribeStatesAsync,
	subscribeObjectsAsync,
	unsubscribeStatesAsync,
	unsubscribeObjectsAsync,
} from "./lib/backend";

/** The namespace of this adapter */
let namespace: string;
/** The selector to subscribe to system state changes (e.g. adapter alive) */
let systemStates: string;
/** The selector to subscribe to all of the adaper's own states */
let adapterStates: string;

interface RootProps {
	settings: Record<string, unknown>;
	onSettingsChanged: OnSettingsChangedCallback;
}

/** The root component displays all components that belong to the adapter configuration */
const Root: React.FC<RootProps> = (props) => {
	// Subscribe and unsubscribe from states and objects
	React.useEffect(() => {
		namespace = `${adapter}.${instance}`;
		// subscribe to changes
		systemStates = `system.adapter.${namespace}.*`;
		adapterStates = `${namespace}.*`;
		window.addEventListener("unload", () => onUnload());

		// If you need to subscribe to some of these states, uncomment the corresponding line
		// Alternatively, subscribe to specific states instead of all of them.

		// void subscribeStatesAsync(systemStates);
		// void subscribeObjectsAsync(adapterStates);
		// void subscribeStatesAsync(adapterStates);

		return onUnload;
	}, []);

	function onUnload(): void {
		// If you subscribed to some of the states above, don't forget to unsubscribe here!
		// void unsubscribeStatesAsync(systemStates);
		// void unsubscribeObjectsAsync(adapterStates);
		// void unsubscribeStatesAsync(adapterStates);
	}

	return (
		/* Render additional components, e.g. tab views here */
		<Settings
			settings={props.settings}
			onChange={props.onSettingsChanged}
		/>
	);
}

// Used to compare the previously saved setting with the current configuration
let curSettings: Record<string, unknown>;
let originalSettings: Record<string, unknown>;

/**
 * Checks if any setting was changed
 */
function hasChanges(): boolean {
	if (Object.keys(originalSettings).length !== Object.keys(curSettings).length) return true;
	for (const key of Object.keys(originalSettings)) {
		if (originalSettings[key] !== curSettings[key]) return true;
	}
	return false;
}

// When the config page is loaded, set up the settings change handler and render the root component
window.load = (settings: Record<string, unknown>, onChange: (hasChanges: boolean) => void) => {
	originalSettings = settings;

	const settingsChanged: OnSettingsChangedCallback = (newSettings) => {
		curSettings = newSettings;
		onChange(hasChanges());
	};

	ReactDOM.render(
		<Root settings={settings} onSettingsChanged={settingsChanged} />,
		document.getElementById("adapter-container") ||
			document.getElementsByClassName("adapter-container")[0],
	);

	// Disable the save buttons because nothing was changed yet
	onChange(false);
};

// When the save button is clicked, overwrite the original settings variable with the new settings
window.save = (callback: (newSettings: Record<string, unknown>) => void) => {
	callback(curSettings);
	originalSettings = curSettings;
};
