import { TemplateFunction } from "../src/lib/createAdapter";

export = (answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	if (!useTypeScript && !useTypeChecking) return;

	const template = `
{
	"compileOnSave": true,
	"compilerOptions": {
		// do not compile anything, this file is just to configure type checking${useTypeScript ? (`
		// the compilation is configured in tsconfig.build.json`) : ""}
		"noEmit": true,

		// check JS files${useTypeScript ? ", but do not compile them => tsconfig.build.json" : ""}
		"allowJs": true,
		"checkJs": true,
		${useTypeScript ? (`
		"noEmitOnError": true,
		"outDir": "./build/",
		"removeComments": false,`) : ""}
		"module": "commonjs",
		"moduleResolution": "node",
		// this is necessary for the automatic typing of the adapter config
		"resolveJsonModule": true,

		// Set this to false if you want to disable the very strict rules (not recommended)
		"strict": true,
		// Or enable some of those features for more fine-grained control
		// "strictNullChecks": true,
		// "strictPropertyInitialization": true,
		// "strictBindCallApply": true,
		${useTypeScript ? `// "noImplicitAny": true,` : `"noImplicitAny": false,`}
		// "noUnusedLocals": true,
		// "noUnusedParameters": true,

		// Consider targetting es2017 or higher if you require the new NodeJS 8+ features
		"target": "es2015",
		${useTypeScript ? (`
		"sourceMap": false,
		"inlineSourceMap": false,
		"watch": false`) : ""}
	},
	"include": [
		"**/*.js",
		"**/*.d.ts"
	],
	"exclude": [
		${useTypeScript ? (`"build/**",
		`) : ""}"node_modules/**",
		"admin/**"
	]
}`;
	return template.trim();
}) as TemplateFunction;
