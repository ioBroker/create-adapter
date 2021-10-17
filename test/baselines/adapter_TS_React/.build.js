/** Build script to use esbuild without specifying 1000 CLI options */
const { build, cliopts } = require("estrella");
const glob = require("tiny-glob");

const [opts, args] = cliopts.parse(
	["react", "Build React sources"],
	["typescript", "Build TypeScript sources"],
);

if (opts.react) {
	(async () => {
		const entryPoints = await glob("./admin/src/{index,tab}.{jsx,tsx}");
		await build({
			entryPoints,
			tsconfig: "./admin/tsconfig.json",
			bundle: true,
			splitting: true,
			format: "esm",
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
	})().catch(() => process.exit(1));
}

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
	})().catch(() => process.exit(1));
}