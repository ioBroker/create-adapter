import { TemplateFunction } from "../../lib/createAdapter";

export = (answers => {

	const isAdapter = answers.features.indexOf("Adapter") > -1;
	if (!isAdapter) return;

	const template = `
/* You can delete those if you want. I just found them very helpful */
* {
	box-sizing: border-box
}
.m {
	/* Don't cut off dropdowns! */
	overflow: initial;
}

/* Add your styles here */

`;
	return template.trim();
}) as TemplateFunction;
