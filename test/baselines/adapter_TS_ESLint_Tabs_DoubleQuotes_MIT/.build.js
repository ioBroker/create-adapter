/** Build script to use esbuild without specifying 1000 CLI options */
const { build, cliopts } = require("estrella");
const glob = require("tiny-glob");

const [opts, args] = cliopts.parse(
	["typescript", "Build TypeScript sources"],
);

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