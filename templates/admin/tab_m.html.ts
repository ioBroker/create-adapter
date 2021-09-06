import { getIconName } from "../../src/lib/core/questions";
import type { TemplateFunction } from "../../src/lib/createAdapter";

export = (answers => {

	const supportTab = answers.adminFeatures && answers.adminFeatures.indexOf("tab") > -1;
	if (!supportTab) return;

	const useReact = answers.tabReact === "yes";

	const template = `
<html>

<head>
${useReact ? 
`	<script type="text/javascript" src="../../socket.io/socket.io.js"></script>` :
`	<link rel="stylesheet" type="text/css" href="../../lib/css/materialize.css">
	<link rel="stylesheet" type="text/css" href="../../css/adapter.css" />

	<script type="text/javascript" src="../../lib/js/jquery-3.2.1.min.js"></script>
	<script type="text/javascript" src="../../socket.io/socket.io.js"></script>
	<script type="text/javascript" src="../../js/translate.js"></script>
	<script type="text/javascript" src="../../lib/js/materialize.js"></script>

	<script type="text/javascript" src="words.js"></script>
	<style>
		.m .col .select-wrapper + label {
			top: -26px;
		}
		.m span{
			font-size: 0.9em;
		}
	</style>`}
</head>

<body>

${useReact ? `
	<!-- this is where the React components are loaded into -->
	<div class="m adapter-container" id="root"></div>

	<!-- load compiled React scripts -->
	<script type="text/javascript" src="build/tab.js"></script>
` : `
	<div class="m adapter-container">
		<div class="row">
			<!-- Forms are the standard way to receive user inputted data.
			 Learn more http://materializecss.com/forms.html-->
			<div class="row">
				<div class="input-field col s6">
					<img src="${getIconName(answers)}" class="logo">
				</div>
			</div>
			<div class="row">
				<div class="input-field col s3">
					<input class="value" id="test1" type="checkbox" />
					<label for="test1" class="translate">test1</label>
				</div>
			</div>
			<div class="row">
				<div class="input-field col s12 m6 l4">
					<input class="value" id="myText" type="text">
					<label for="myText">Text</label>
					<span class="translate">Descriptions of the input field</span>
				</div>
				<div class="input-field col s12 m6 l4">
					<input type="number" class="value" id="test2" />
					<label for="test2" class="translate">Number</label>
					<!-- Important: label must come directly after input. Label is important. -->
					<span class="translate">test2</span>
				</div>
				<div class="input-field col s12 m6 l4">
					<input id="email" type="email" class="value validate">
					<label for="email" data-error="wrong" data-success="right">Email</label>
					<!--  You can add custom validation messages by adding either data-error or data-success attributes to your input field labels.-->
					<span class="translate">Verification input</span>
				</div>
			</div>
			<div class="row">
				<div class="input-field col s12 m4">
					<select class="value" id="mySelect">
						<option value="auto" class="translate">Auto</option>
						<option value="manual" class="translate">Manual</option>
					</select>
					<label for="mySelect" class="translate">My select</label>
					<!-- Important: label must come directly after select. Label is important. -->
				</div>
				<div class="input-field col s12 m8">
					<i class="material-icons prefix">mode_edit</i>
					<textarea id="Textarea" class="value materialize-textarea"></textarea>
					<label for="Textarea">Message</label>
				</div>
			</div>
		</div>
	</div>
`}
</body>

</html>
`;
	return template.trim();
}) as TemplateFunction;
