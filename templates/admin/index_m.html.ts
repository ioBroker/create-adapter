import { AdapterSettings, getDefaultAnswer, getIconName } from "../../src/lib/core/questions";
import type { TemplateFunction } from "../../src/lib/createAdapter";

function generateSettingsDiv(settings: AdapterSettings): string {
	if (settings.inputType === "select" && settings.options) {
		const options = settings.options.map(opt => `
					<option value="${opt.value}">${opt.text}</option>`).join("");
		return `
			<div class="col s6 input-field">
				<select class="value" id="${settings.key}">${options}
				</select>
				<label for="${settings.key}" class="translate">${settings.label || settings.key}</label>
			</div>`;
	} else {
		return `
			<div class="col s6 input-field">
				<input type="${settings.inputType}" class="value" id="${settings.key}" />
				<label for="${settings.key}" class="translate">${settings.label || settings.key}</label>
			</div>`;
	}
}

export = (answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	if (!isAdapter) return;

	const useReact = answers.adminReact === "yes";

	const adapterSettings: AdapterSettings[] = answers.adapterSettings ?? getDefaultAnswer("adapterSettings")!;

	const template = `
<html>

<head>

	<!-- Load ioBroker scripts and styles-->
	<link rel="stylesheet" type="text/css" href="../../css/adapter.css" />
${useReact ? 
`	<script type="text/javascript" src="../../socket.io/socket.io.js"></script>` :
`	<link rel="stylesheet" type="text/css" href="../../lib/css/materialize.css">

	<script type="text/javascript" src="../../lib/js/jquery-3.2.1.min.js"></script>
	<script type="text/javascript" src="../../socket.io/socket.io.js"></script>

	<script type="text/javascript" src="../../js/translate.js"></script>
	<script type="text/javascript" src="../../lib/js/materialize.js"></script>
	<script type="text/javascript" src="../../js/adapter-settings.js"></script>`}

	<!-- Load our own files -->
	<link rel="stylesheet" type="text/css" href="style.css" />
${useReact ? "" :
`	<script type="text/javascript" src="words.js"></script>

	<script type="text/javascript">
		// This will be called by the admin adapter when the settings page loads
		function load(settings, onChange) {
			// example: select elements with id=key and class=value and insert value
			if (!settings) return;
			$('.value').each(function () {
				var $key = $(this);
				var id = $key.attr('id');
				if ($key.attr('type') === 'checkbox') {
					// do not call onChange direct, because onChange could expect some arguments
					$key.prop('checked', settings[id])
						.on('change', () => onChange())
						;
				} else {
					// do not call onChange direct, because onChange could expect some arguments
					$key.val(settings[id])
						.on('change', () => onChange())
						.on('keyup', () => onChange())
						;
				}
			});
			onChange(false);
			// reinitialize all the Materialize labels on the page if you are dynamically adding inputs:
			if (M) M.updateTextFields();
		}

		// This will be called by the admin adapter when the user presses the save button
		function save(callback) {
			// example: select elements with class=value and build settings object
			var obj = {};
			$('.value').each(function () {
				var $this = $(this);
				if ($this.attr('type') === 'checkbox') {
					obj[$this.attr('id')] = $this.prop('checked');
				} else if ($this.attr('type') === 'number') {
					obj[$this.attr('id')] = parseFloat($this.val());
				} else {
					obj[$this.attr('id')] = $this.val();
				}
			});
			callback(obj);
		}
	</script>
`}
</head>

<body>

${useReact ? (`
	<!-- this is where the React components are loaded into -->
	<div class="m adapter-container" id="root"></div>

	<!-- load compiled React scripts -->
	<script type="text/javascript" src="build/index.js"></script>
`) : (`
	<div class="m adapter-container">

		<div class="row">
			<div class="col s12 m4 l2">
				<img src="${getIconName(answers)}" class="logo">
			</div>
		</div>

		<!-- Put your content here -->

		<!-- For example columns with settings: -->
		<div class="row">${adapterSettings.map(generateSettingsDiv).join("\n")}
		</div>

	</div>
`)}
</body>

</html>
`;
	return template.trim();
}) as TemplateFunction;
