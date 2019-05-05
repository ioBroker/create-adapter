import axios from "axios";

/**
 * Tests whether the given variable is a real object and not an Array
 * @param it The variable to test
 */
export function isObject(it: any): it is object {
	// This is necessary because:
	// typeof null === 'object'
	// typeof [] === 'object'
	// [] instanceof Object === true
	return Object.prototype.toString.call(it) === "[object Object]";
}

/**
 * Tests whether the given variable is really an Array
 * @param it The variable to test
 */
export function isArray(it: any): it is any[] {
	if (Array.isArray != null) return Array.isArray(it);
	return Object.prototype.toString.call(it) === "[object Array]";
}

/**
 * Translates text using the Google Translate API
 * @param text The text to translate
 * @param targetLang The target languate
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
	if (targetLang === "en") return text;
	try {
		const url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}&ie=UTF-8&oe=UTF-8`;
		const response = await axios({url, timeout: 5000});
		if (isArray(response.data)) {
			// we got a valid response
			return response.data[0][0][0];
		}
		throw new Error("Invalid response for translate request");
	} catch (e) {
		throw new Error(`Could not translate to "${targetLang}": ${e}`);
	}
}
