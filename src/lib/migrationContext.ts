import { existsSync, readdir, readFile, readJson, stat } from "fs-extra";
import path = require("path");

export class MigrationContext {
	public packageJson: any;
	public ioPackageJson: any;

	constructor(private readonly baseDir: string) {}

	public async load(): Promise<void> {
		this.packageJson = await this.readJsonFile("package.json");
		this.ioPackageJson = await this.readJsonFile("io-package.json");
	}

	public async readJsonFile<T>(fileName: string): Promise<T> {
		return (await readJson(path.join(this.baseDir, fileName))) as T;
	}

	public async directoryExists(dirName: string): Promise<boolean> {
		const fullPath = path.join(this.baseDir, dirName);
		return existsSync(fullPath) && (await stat(fullPath)).isDirectory();
	}

	public async fileExists(dirName: string): Promise<boolean> {
		const fullPath = path.join(this.baseDir, dirName);
		return existsSync(fullPath) && (await stat(fullPath)).isFile();
	}

	public async hasFilesWithExtension(
		dirName: string,
		extension: string,
		filter?: (fileName: string) => boolean,
	): Promise<boolean> {
		return (
			(await this.directoryExists(dirName)) &&
			(await readdir(path.join(this.baseDir, dirName))).some(
				(f) =>
					(!filter || filter(f)) &&
					f.toLowerCase().endsWith(extension.toLowerCase()),
			)
		);
	}

	public hasDevDependency(packageName: string): boolean {
		return this.packageJson.devDependencies?.hasOwnProperty(packageName);
	}

	public async getMainFileContent(): Promise<string> {
		if (
			!this.packageJson.main ||
			!this.packageJson.main.endsWith(".js") ||
			!(await this.fileExists(this.packageJson.main))
		) {
			// we don't have a main JavaScript file, it will be impossible to find code
			return "";
		}

		try {
			const tsMains = [
				path.join(
					this.baseDir,
					"src",
					this.packageJson.main.replace(/\.js$/, ".ts"),
				),
				path.join(
					this.baseDir,
					this.packageJson.main
						.replace(/\.js$/, ".ts")
						.replace(/^dist([\\/])/, "src$1"),
				),
				path.join(
					this.baseDir,
					this.packageJson.main
						.replace(/\.js$/, ".ts")
						.replace(/^build([\\/])/, "src$1"),
				),
				path.join(
					this.baseDir,
					this.packageJson.main
						.replace(/\.js$/, ".ts")
						.replace(/^(build|dist)[\\/]/, ""),
				),
			];
			for (let i = 0; i < tsMains.length; i++) {
				const tsMain = tsMains[i];
				if (existsSync(tsMain)) {
					// most probably TypeScript
					return await readFile(tsMain, { encoding: "utf8" });
				}
			}

			return await readFile(
				path.join(this.baseDir, this.packageJson.main),
				{ encoding: "utf8" },
			);
		} catch {
			// we don't want this to crash, so just return an empty string
			return "";
		}
	}

	public async analyzeCode(either: string, or: string): Promise<boolean> {
		const content = await this.getMainFileContent();
		const eitherCount = (content.match(new RegExp(either, "g")) || [])
			.length;
		const orCount = (content.match(new RegExp(or, "g")) || []).length;
		return eitherCount >= orCount;
	}
}
