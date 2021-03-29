export abstract class MigrationContextBase {
	public packageJson: any;
	public ioPackageJson: any;

	public abstract joinPath(...parts: string[]): string;

	public abstract readTextFile(fileName: string): Promise<string>;
	public abstract readJsonFile<T>(fileName: string): Promise<T>;

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
			for (let i = 0; i < tsMains.length; i++) {
				const tsMain = tsMains[i];
				if (await this.fileExists(tsMain)) {
					// most probably TypeScript
					return this.readTextFile(tsMain);
				}
			}

			return this.readTextFile(this.packageJson.main);
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
