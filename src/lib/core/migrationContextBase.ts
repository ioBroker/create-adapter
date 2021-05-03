export abstract class MigrationContextBase {
	public packageJson!: Record<string, any>;
	public ioPackageJson!: Record<string, any>;

	public abstract joinPath(...parts: string[]): string;

	public abstract readTextFile(fileName: string): Promise<string>;
	public abstract readJsonFile(
		fileName: string,
	): Promise<Record<string, any>>;

	public abstract directoryExists(dirName: string): Promise<boolean>;
	public abstract fileExists(dirName: string): Promise<boolean>;

	public abstract hasFilesWithExtension(
		dirName: string,
		extension: string,
		filter?: (fileName: string) => boolean,
	): Promise<boolean>;

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
				this.joinPath(
					"src",
					this.packageJson.main.replace(/\.js$/, ".ts"),
				),
				this.packageJson.main
					.replace(/\.js$/, ".ts")
					.replace(/^dist([\\/])/, "src$1"),
				this.packageJson.main
					.replace(/\.js$/, ".ts")
					.replace(/^build([\\/])/, "src$1"),
				this.packageJson.main
					.replace(/\.js$/, ".ts")
					.replace(/^(build|dist)[\\/]/, ""),
			];
			for (const tsMain of tsMains) {
				if (await this.fileExists(tsMain)) {
					// most probably TypeScript
					return await this.readTextFile(tsMain);
				}
			}
			return await this.readTextFile(this.packageJson.main);
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
