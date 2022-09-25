# Update Release Script to v3

Version 3 of the release script is much more powerful, but also requires a few changes to your adapter:

**Install the latest version and additional plugins:**

```bash
npm i -D @alcalzone/release-script@latest @alcalzone/release-script-plugin-iobroker@latest @alcalzone/release-script-plugin-license@latest @alcalzone/release-script-plugin-manual-review@latest
```

**Configure the release script to use the new plugins:**

Add a new file `.releaseconfig.json` with the following contents:

```json
{
	"plugins": ["iobroker", "license", "manual-review"]
}
```

These plugins will do the following:

-   Update io-package.json, including translating the news
-   Check the license to make sure it contains an up to date year
-   Ask you to review the automatically done changes before publishing

If your adapter uses TypeScript or React or something else that needs a build step, you can instruct the release script to execute this before committing the changes:

```json
{
	"plugins": ["iobroker", "license", "manual-review"],
	"exec": {
		"before_commit": "npm run build"
	}
}
```

For more details on the changes, see https://github.com/AlCalzone/release-script
