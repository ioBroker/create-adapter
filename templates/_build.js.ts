import type { TemplateFunction } from "../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const useTypeScript = answers.language === "TypeScript";
	const useReact =
		answers.adminReact === "yes" || answers.tabReact === "yes";

	// This is only required for TypeScript or React
	if (!useTypeScript && !useReact) return;

	const template = `
/** Build script to use esbuild without specifying 1000 CLI options */
const { build, cliopts } = require("estrella");
const glob = require("tiny-glob");

const [opts, args] = cliopts.parse(${useReact ? `
	["react", "Build React sources"],` : ""}${useTypeScript ? `
	["typescript", "Build TypeScript sources"],` : ""}
);
${useReact ? `
if (opts.react) {
	(async () => {
		const entryPoints = await glob("./admin/src/{index,tab}.{jsx,tsx}");
		await build({
			entryPoints,
			tsconfig: "./admin/tsconfig.json",
			bundle: true,
			splitting: true,
			format: "esm",
			target: "es2018",
			minify: !cliopts.watch,
			outdir: "admin/build",
			sourcemap: true,
			// sourcesContent: true,
			logLevel: "info",
			define: {
				"process.env.NODE_ENV": cliopts.watch
					? '"development"'
					: '"production"',
			},
		});
	})().catch((e) => {
		console.error(e);
		process.exit(1)
	});
}` : ""}
${useTypeScript ? `
if (opts.typescript) {
	(async () => {
		let entryPoints = await glob("./src/**/*.ts");
		entryPoints = entryPoints.filter(
			(ep) => !ep.endsWith(".d.ts") && !ep.endsWith(".test.ts"),
		);
		await build({
			entryPoints,
			tsconfig: "./tsconfig.build.json",
			outdir: "build",
			bundle: false,
			minify: false,
			sourcemap: true,
			logLevel: "info",
			platform: "node",
			format: "cjs",
			target: "node12",
		});
	})().catch((e) => {
		console.error(e);
		process.exit(1)
	});
}` : ""}
`;
	return template.trim();
};

templateFunction.customPath = ".build.js";
export = templateFunction;
