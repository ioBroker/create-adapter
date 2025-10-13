// ioBroker prettier configuration file
import prettierConfig from "@iobroker/eslint-config/prettier.config.mjs";

export default {
	...prettierConfig,
	// Use tabs for indentation (project preference)
	useTabs: true,
	// Keep double quotes as this project prefers them
	singleQuote: false,
};
