import { Answers } from "../../lib/questions";

export = async (answers: Answers) => {

	const isAdapter = answers.features.indexOf("Adapter") > -1;
	if (!isAdapter) return;

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

</head>

<body>

	<div class="m adapter-container">

		<!-- Put your content here -->

	</div>

</body>

</html>
`;
	return template.trim();
};
