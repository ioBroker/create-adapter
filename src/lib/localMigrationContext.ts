import { existsSync, readdir, readFile, readJson, stat } from "fs-extra";
import { MigrationContextBase } from "./core/migrationContextBase";
import path = require("path");

/**
 *
 */
export class LocalMigrationContext extends MigrationContextBase {
	/**
	 *
	 * @param baseDir
	 */
	constructor(private readonly baseDir: string) {
		super();
	}

	/**
	 *
	 */
	public async load(): Promise<void> {
		this.packageJson = await this.readJsonFile("package.json");
		this.ioPackageJson = await this.readJsonFile("io-package.json");
	}

	/**
	 *
	 * @param parts
	 */
	public joinPath(...parts: string[]): string {
		return path.join(...parts);
	}

	/**
	 *
	 * @param fileName
	 */
	public readTextFile(fileName: string): Promise<string> {
		return readFile(path.join(this.baseDir, fileName), {
			encoding: "utf8",
		});
	}

	/**
	 *
	 * @param fileName
	 */
	public async readJsonFile(fileName: string): Promise<Record<string, any>> {
		return readJson(path.join(this.baseDir, fileName));
	}

	/**
	 *
	 * @param dirName
	 */
	public async directoryExists(dirName: string): Promise<boolean> {
		const fullPath = path.join(this.baseDir, dirName);
		return existsSync(fullPath) && (await stat(fullPath)).isDirectory();
	}

	/**
	 *
	 * @param dirName
	 */
	public async fileExists(dirName: string): Promise<boolean> {
		const fullPath = path.join(this.baseDir, dirName);
		return existsSync(fullPath) && (await stat(fullPath)).isFile();
	}

	/**
	 *
	 * @param dirName
	 * @param extension
	 * @param filter
	 */
	public async hasFilesWithExtension(
		dirName: string,
		extension: string,
		filter?: (fileName: string) => boolean,
	): Promise<boolean> {
		return (
			(await this.directoryExists(dirName)) &&
			(await readdir(path.join(this.baseDir, dirName))).some(
				f => (!filter || filter(f)) && f.toLowerCase().endsWith(extension.toLowerCase()),
			)
		);
	}
}
