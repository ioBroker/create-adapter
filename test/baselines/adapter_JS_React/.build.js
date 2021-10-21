/** Build script to use esbuild without specifying 1000 CLI options */
const { build, cliopts } = require("estrella");
const glob = require("tiny-glob");

const [opts, args] = cliopts.parse(
	["react", "Build React sources"],
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
}