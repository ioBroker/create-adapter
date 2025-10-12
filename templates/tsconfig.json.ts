import type { TemplateFunction } from "../src/lib/createAdapter";
import { RECOMMENDED_NODE_VERSION_FALLBACK } from "../src/lib/constants";

export = (answers => {
	const useTypeScript = answers.language === "TypeScript";
	const useTypeChecking = answers.tools && answers.tools.indexOf("type checking") > -1;
	if (!useTypeScript && !useTypeChecking) {
		return;
	}

	const minNodeVersion = answers.nodeVersion ?? RECOMMENDED_NODE_VERSION_FALLBACK;

	let include: string;
	let exclude: string;

	if (useTypeScript) {
		include = `
		"src/**/*.ts",
		"test/**/*.ts"`;
		exclude = `
		"build/**",`;
	} else {
		include = `
		"**/*.js",
		"**/*.d.ts"`;
		exclude = ``;
	}

	const template = `
// Root tsconfig to set the settings and power editor support for all TS files
{
	// To update the compilation target, install a different version of @tsconfig/node... and reference it here
	// https://github.com/tsconfig/bases#node-${minNodeVersion}-tsconfigjson
	"extends": "@tsconfig/node${minNodeVersion}/tsconfig.json",
	"compilerOptions": {
		// do not compile anything, this file is just to configure type checking${
			useTypeScript
				? `
		// the compilation is configured in tsconfig.build.json`
				: ""
		}
		"noEmit": true,

		// check JS files${useTypeScript ? ", but do not compile them => tsconfig.build.json" : ""}
		"allowJs": true,
		"checkJs": true,
		${
			useTypeScript
				? `
		"noEmitOnError": true,
		"outDir": "./build/",
		"removeComments": false,`
				: ""
		}

		// This is necessary for the automatic typing of the adapter config
		"resolveJsonModule": true,

		// If you want to disable the stricter type checks (not recommended), uncomment the following line
		// "strict": false,
		// And enable some of those features for more fine-grained control
		// "strictNullChecks": true,
		// "strictPropertyInitialization": true,
		// "strictBindCallApply": true,
		${useTypeScript ? `// "noImplicitAny": true,` : `"noImplicitAny": false,`}
		// "noUnusedLocals": true,
		// "noUnusedParameters": true,
		${
			useTypeScript
				? `// Uncomment this if you want the old behavior of catch variables being \`any\`
		// "useUnknownInCatchVariables": false,`
				: `"useUnknownInCatchVariables": false,`
		}

		${
			useTypeScript
				? `
		"sourceMap": true,
		"inlineSourceMap": false`
				: ""
		}
	},
	"include": [${include}
	],
	"exclude": [${exclude}
		"node_modules/**",
		"widgets/**"
	]
}`;
	return template.trim();
}) as TemplateFunction;
