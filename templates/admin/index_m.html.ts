import { TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {

	const isAdapter = answers.features.indexOf("adapter") > -1;
	if (!isAdapter) return;

	const useReact = answers.adminReact === "yes";

	let parameters: string;

	// generate parameters on the web page
	if (answers.parameters) {
		parameters = "";
		answers.parameters.forEach(param => {
			if (param.type === "checkbox") {
				parameters += `
					<div class="col s6 input-field">
						<input type="checkbox" class="value" id="${param.name}" />
						<span for="${param.name}" class="translate">${param.title}</span>
					</div>`;
			} else if (param.type === "select" && param.options) {
				let options = "";
				param.options.forEach(opt =>
					options += `<option value="${opt.value}">${opt.text}</option>`);

				parameters += `
					<div class="col s6 input-field">
						<select class="value" id="${param.name}">
							${options}
						</select>
						<label for="${param.name}" class="translate">${param.title}</label>
					</div>`;
			} else {
				parameters += `
					<div class="col s6 input-field">
						<input type="${param.type || "text"}" class="value" id="${param.name}" />
						<label for="${param.name}" class="translate">${param.title}</label>
					</div>`;
			}

		});
	} else {
		parameters = `
			<div class="col s6 input-field">
				<input type="checkbox" class="value" id="option1" />
				<label for="option1" class="translate">option 1 description</label>
			</div>
			<div class="col s6 input-field">
				<input type="text" class="value" id="option2" />
				<label for="option2" class="translate">option 2 description</label>
			</div>`;
	}

	const template = `
<html>

<head>

	<!-- Load ioBroker scripts and styles-->
	<link rel="stylesheet" type="text/css" href="../../css/adapter.css" />
	<link rel="stylesheet" type="text/css" href="../../lib/css/materialize.css">

	<script type="text/javascript" src="../../lib/js/jquery-3.2.1.min.js"></script>
	<script type="text/javascript" src="../../socket.io/socket.io.js"></script>

	<script type="text/javascript" src="../../js/translate.js"></script>
	<script type="text/javascript" src="../../lib/js/materialize.js"></script>
	<script type="text/javascript" src="../../js/adapter-settings.js"></script>

	<!-- Load our own files -->
	<link rel="stylesheet" type="text/css" href="style.css" />
	<script type="text/javascript" src="words.js"></script>

${useReact ? "" : (`
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
				} else {
					obj[$this.attr('id')] = $this.val();
				}
			});
			callback(obj);
		}
	</script>
`)}
</head>

<body>

	<div class="m adapter-container">
		<div class="row">
			<div class="col s12 m4 l2">
				<img src="${answers.adapterName}.png" class="logo">
			</div>
		</div>
		<!-- For example columns with settings: -->
		<div class="row">
			${parameters}
		</div>

	</div>

</body>

</html>
`;
	return template.trim();
}) as TemplateFunction;
