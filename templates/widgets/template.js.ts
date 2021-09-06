import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isWidget = answers.features.indexOf("vis") > -1;
	if (!isWidget) return;

	const widgetName = answers.adapterName;

	const template = `
/*
	ioBroker.vis ${widgetName} Widget-Set

	version: "0.0.1"

	Copyright ${new Date().getFullYear().toString()} ${answers.authorName} ${answers.authorEmail}
*/
"use strict";

// add translations for edit mode
$.extend(
	true,
	systemDictionary,
	{
		// Add your translations here, e.g.:
		// "size": {
		// 	"en": "Size",
		// 	"de": "Größe",
		// 	"ru": "Размер",
		// 	"pt": "Tamanho",
		// 	"nl": "Grootte",
		// 	"fr": "Taille",
		// 	"it": "Dimensione",
		// 	"es": "Talla",
		// 	"pl": "Rozmiar",
		// 	"zh-cn": "尺寸"
		// }
	}
);

// this code can be placed directly in ${answers.adapterName}.html
vis.binds["${widgetName}"] = {
	version: "0.0.1",
	showVersion: function () {
		if (vis.binds["${widgetName}"].version) {
			console.log('Version ${widgetName}: ' + vis.binds["${widgetName}"].version);
			vis.binds["${widgetName}"].version = null;
		}
	},
	createWidget: function (widgetID, view, data, style) {
		var $div = $('#' + widgetID);
		// if nothing found => wait
		if (!$div.length) {
			return setTimeout(function () {
				vis.binds["${widgetName}"].createWidget(widgetID, view, data, style);
			}, 100);
		}

		var text = '';
		text += 'OID: ' + data.oid + '</div><br>';
		text += 'OID value: <span class="${widgetName}-value">' + vis.states[data.oid + '.val'] + '</span><br>';
		text += 'Color: <span style="color: ' + data.myColor + '">' + data.myColor + '</span><br>';
		text += 'extraAttr: ' + data.extraAttr + '<br>';
		text += 'Browser instance: ' + vis.instance + '<br>';
		text += 'htmlText: <textarea readonly style="width:100%">' + (data.htmlText || '') + '</textarea><br>';

		$('#' + widgetID).html(text);

		// subscribe on updates of value
		function onChange(e, newVal, oldVal) {
			$div.find('.template-value').html(newVal);
		}
		if (data.oid) {
			vis.states.bind(data.oid + '.val', onChange);
			//remember bound state that vis can release if didnt needed
			$div.data('bound', [data.oid + '.val']);
			//remember onchange handler to release bound states
			$div.data('bindHandler', onChange);
		}
	}
};

vis.binds["${widgetName}"].showVersion();
`;
	return template.trim();
};

templateFunction.customPath = answers => `widgets/${answers.adapterName}/js/${answers.adapterName}.js`;
export = templateFunction;
