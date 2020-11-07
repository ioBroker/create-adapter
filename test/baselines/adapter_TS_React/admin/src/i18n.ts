/*
 * This file loads the translations keys from `i18n/en.json` file and exports a
 * more typed translate function `I18n.t`.
 * Using this definitions it is ensured that all used translations in the react
 * context will be defined at least in the english translations file.
 * This will add no overhead in the generated code since it just reexports the
 * I18n class but with a more typed t function.
 */

import I18n from "@iobroker/adapter-react/i18n";

import en from "./i18n/en.json";

/**
 * Available words in `i18n/en.json`.
 */
type AdminWord = keyof typeof en;

interface I18nTypedT {
	/**
	 * Translate the given string to the selected language.
	 * @param {string} word The (key) word to look up the string. Has to be defined at least in `i18n/en.json`.
	 * @param {string[]} args Optional arguments which will replace the first (second, third, ...) occurence of %s
	 */
	t: (word: AdminWord, ...args: string[]) => string;
}

type I18nTyped = Omit<typeof I18n, "t"> & I18nTypedT

export default I18n as I18nTyped;