"use strict";
module.exports = async (answers) => {
    const isAdapter = answers.features.indexOf("Adapter") > -1;
    if (!isAdapter)
        return;
    const template = `
/*global systemDictionary:true */
'use strict';

systemDictionary = {
	"option 1 description": {
		"en": "Option 1 is cool",
		"de": "Option 1 ist cool",
		"ru": "Вариант 1 - это круто",
		"pt": "Opção 1 é legal",
		"nl": "Optie 1 is cool",
		"fr": "L'option 1 est cool",
		"it": "L'opzione 1 è cool",
		"es": "La opción 1 es genial",
		"pl": "Opcja 1 jest fajna"
	},
	"option 2 description": {
		"en": "Option 2 is not",
		"de": "Option 2 nicht",
		"ru": "Вариант 2 не",
		"pt": "A opção 2 não é",
		"nl": "Optie 2 is dat niet",
		"fr": "L'option 2 n'est pas",
		"it": "L'opzione 2 no",
		"es": "La opción 2 no es",
		"pl": "Opcja 2 nie jest"
	}
};
`;
    return template.trim();
};
