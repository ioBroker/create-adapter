"use strict";
const templateFunction = answers => {
    const isWidget = answers.features.indexOf("VIS widget") > -1;
    if (!isWidget)
        return;
    const widgetName = answers.adapterName;
    const widgetNameCapitalized = widgetName[0].toUpperCase() + widgetName.slice(1);
    const template = `
/*
	ioBroker.vis ${widgetName} Widget-Set

	version: "0.0.1"

	Copyright ${new Date().getFullYear().toString()} ${answers.authorName} ${answers.authorEmail}
*/
"use strict";

// add translations for edit mode
if (vis.editMode) {
	$.extend(true, systemDictionary, {
		"myColor":          {"en": "myColor",       "de": "mainColor",  "ru": "Мой цвет"},
		"myColor_tooltip":  {
			"en": "Description of\\x0AmyColor",
			"de": "Beschreibung von\\x0AmyColor",
			"ru": "Описание\\x0AmyColor"
		},
		"htmlText":         {"en": "htmlText",      "de": "htmlText",   "ru": "htmlText"},
		"group_extraMyset": {"en": "extraMyset",    "de": "extraMyset", "ru": "extraMyset"},
		"extraAttr":        {"en": "extraAttr",     "de": "extraAttr",  "ru": "extraAttr"}
	});
}

// add translations for non-edit mode
$.extend(true, systemDictionary, {
	"Instance":  {"en": "Instance", "de": "Instanz", "ru": "Инстанция"}
});

// this code can be placed directly in ${widgetName}.html
vis.binds.${widgetName} = {
	version: "0.0.1",
	showVersion: function () {
		if (vis.binds.${widgetName}.version) {
			console.log('Version ${widgetName}: ' + vis.binds.${widgetName}.version);
			vis.binds.${widgetName}.version = null;
		}
	},
	createWidget: function (widgetID, view, data, style) {
		var $div = $('#' + widgetID);
		// if nothing found => wait
		if (!$div.length) {
			return setTimeout(function () {
				vis.binds.${widgetName}.createWidget(widgetID, view, data, style);
			}, 100);
		}

		var text = '';
		text += 'OID: ' + data.oid + '</div><br>';
		text += 'OID value: <span class="myset-value">' + vis.states[data.oid + '.val'] + '</span><br>';
		text += 'Color: <span style="color: ' + data.myColor + '">' + data.myColor + '</span><br>';
		text += 'extraAttr: ' + data.extraAttr + '<br>';
		text += 'Browser instance: ' + vis.instance + '<br>';
		text += 'htmlText: <textarea readonly style="width:100%">' + (data.htmlText || '') + '</textarea><br>';

		$('#' + widgetID).html(text);

		// subscribe on updates of value
		if (data.oid) {
			vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
				$div.find('.${widgetName}-value').html(newVal);
			});
		}
	}
};

vis.binds.${widgetName}.showVersion();
`;
    return template.trim();
};
templateFunction.customPath = answers => `widgets/${answers.adapterName}/js/${answers.adapterName}.js`;
module.exports = templateFunction;
