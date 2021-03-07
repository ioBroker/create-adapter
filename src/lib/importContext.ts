import {
	existsSync,
	readdirSync,
	readFileSync,
	readJsonSync,
	statSync,
} from "fs-extra";
import path = require("path");

export class ImportContext {
	public readonly packageJson: any;
	public readonly ioPackageJson: any;

	constructor(private readonly baseDir: string) {
		console.log(`Importing from ${baseDir}`);
		this.packageJson = this.readJsonFile("package.json");
		this.ioPackageJson = this.readJsonFile("io-package.json");
	}

	public readJsonFile<T>(fileName: string): T {
		return readJsonSync(path.join(this.baseDir, fileName)) as T;
	}

	public directoryExists(dirName: string): boolean {
		const fullPath = path.join(this.baseDir, dirName);
		return existsSync(fullPath) && statSync(fullPath).isDirectory();
	}

	public fileExists(dirName: string): boolean {
		const fullPath = path.join(this.baseDir, dirName);
		return existsSync(fullPath) && statSync(fullPath).isFile();
	}

	public hasFilesWithExtension(dirName: string, extension: string): boolean {
		return (
			this.directoryExists(dirName) &&
			!!readdirSync(path.join(this.baseDir, dirName)).find((f) =>
				f.toLowerCase().endsWith(extension.toLowerCase()),
			)
		);
	}

	public hasDevDependency(packageName: string): boolean {
		return (
			this.packageJson.devDependencies &&
			this.packageJson.devDependencies.hasOwnProperty(packageName)
		);
	}

	public getMainFileContent(): string {
		if (
			!this.packageJson.main ||
			!this.packageJson.main.endsWith(".js") ||
			!this.fileExists(this.packageJson.main)
		) {
			// we don't have a main JavaScript file, it will be impossible to find code
			return "";
		}

		try {
			const tsMain = path.join(
				this.baseDir,
				"src",
				this.packageJson.main.replace(/\.js$/, ".ts"),
			);
			if (existsSync(tsMain)) {
				// most probably TypeScript
				return readFileSync(tsMain, { encoding: "utf8" });
			} else {
				return readFileSync(
					path.join(this.baseDir, this.packageJson.main),
					{ encoding: "utf8" },
				);
			}
		} catch {
			// we don't want this to crash, so just return an empty string
			return "";
		}
	}

	public analyzeCode(either: string, or: string): boolean {
		const content = this.getMainFileContent();
		const eitherCount = (content.match(new RegExp(either, "g")) || [])
			.length;
		const orCount = (content.match(new RegExp(or, "g")) || []).length;
		return eitherCount >= orCount;
	}
}
