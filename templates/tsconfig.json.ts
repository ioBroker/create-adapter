import type { TemplateFunction } from "../src/lib/createAdapter";

export = (answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	if (!useTypeScript && !useTypeChecking) return;

	const template = `
// Root tsconfig to set the settings and power editor support for all TS files
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
		"skipLibCheck": true, // Don't report errors in 3rd party definitions
		"noEmitOnError": true,
		"outDir": "./build/",
		"removeComments": false,`) : ""}
		"module": "commonjs",
		"moduleResolution": "node",
		"esModuleInterop": true,
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
		${useTypeScript ? (
		`// Uncomment this if you want the old behavior of catch variables being \`any\`
		// "useUnknownInCatchVariables": false,`) : (
		`"useUnknownInCatchVariables": false,`)}

		// Consider targetting es2019 or higher if you only support Node.js 12+
		"target": "es2018",
		${useTypeScript ? (`
		"sourceMap": true,
		"inlineSourceMap": false,
		"watch": false`) : ""}
	},
	"include": [${useTypeScript ? (`
		"src/**/*.ts",
		"admin/**/*.ts",
		"admin/**/*.tsx"
`) : (`
		"**/*.js",
		"**/*.d.ts"
`)}	],
	"exclude": [
		${useTypeScript ? (`"build/**",
		`) : ""}"node_modules/**"
	]
}`;
	return template.trim();
}) as TemplateFunction;
