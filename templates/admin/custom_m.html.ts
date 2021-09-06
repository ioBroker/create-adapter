import type { TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {

	const supportCustom = answers.adminFeatures && answers.adminFeatures.indexOf("custom") > -1;
	if (!supportCustom) return;

	const template = `
<script type="text/x-iobroker" data-template-name="${answers.adapterName}">
	<div class="row">
		<div class="col s2">
			<input type="checkbox" data-field="enabled" data-default="false"/>
			<!-- this field is mandatory, just to find out if to include this settings or not</span-->
			<span class="translate">enabled</span>
		</div>
		<div class="col s4">
			<input type="text" data-field="interval" size="30">
			<span class="translate">period of time</span>
		</div>
		<div class="col s4">
			<input type="text" data-field="state" size="30">
			<span class="translate">new state</span>
		</div>
		<div class="col s2">
			<input type="checkbox" data-field="setAck" data-default="false">
			<span class="translate">ack</span>
		</div>
	</div>
</script>

<script type="text/javascript">
	$.get("adapter/${answers.adapterName}/words.js", function(script) {
		let translation = script.substring(script.indexOf('{'), script.length);
		translation = translation.substring(0, translation.lastIndexOf(';'));
		$.extend(systemDictionary, JSON.parse(translation));
	});

	// There are two ways how to predefine default settings:
	// - with attribute "data-default" (content independent)
	// - with function in global variable "defaults". Function name is equal with adapter name.
	//   as input function receives object with all information concerning it
	if (typeof defaults !== 'undefined') {
		defaults["${answers.adapterName}"] = function (obj, instanceObj) {
			return {
				enabled:        false,
				interval:       '5m',
				state:          false,
				setAck:         false
			};
		}
	}
</script>
`;
	return template.trim();
}) as TemplateFunction;
