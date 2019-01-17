import { TemplateFunction } from "../../lib/createAdapter";

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
$.get( "adapter/${widgetName}/words.js", function(script) { 
    let translation = script.substring(script.indexOf('{'), script.length); 
    translation = translation.substring(0, translation.lastIndexOf(';')); 
    $.extend(systemDictionary, JSON.parse(translation)); 
});

// this code can be placed directly in ${widgetName}.html
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

vis.binds["${widgetName}"].showVersion();
`;
	return template.trim();
};

templateFunction.customPath = answers => `widgets/${answers.adapterName}/js/${answers.adapterName}.js`;
export = templateFunction;
