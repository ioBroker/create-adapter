# Enable JSON schema support for `io-package.json` in VSCode

Modern editors like VSCode and WebStorm have JSON Schema support when editing common `.json` files. This provides you with auto-completion and warns you of errors in your files.
To make VSCode enable this feature for 3rd-party files like `io-package.json`, a setting needs to be enabled in the project settings. To do so, edit `.vscode/settings.json` and add the following:

```json
	"json.schemas": [
		{
			"fileMatch": ["io-package.json"],
			"url": "https://json.schemastore.org/io-package"
		}
	]
```
