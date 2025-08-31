# Enable syntax help for JSON Config in VSCode

If you want to have syntax help for JSON Config in VSCode, open `.vscode/settings.json` and add the following inside the `json.schemas` section:

```json
{
	"fileMatch": [
		"admin/jsonConfig.json",
		"admin/jsonCustom.json",
		"admin/jsonTab.json"
	],
	"url": "https://raw.githubusercontent.com/ioBroker/ioBroker.admin/master/packages/jsonConfig/schemas/jsonConfig.json"
}
```

The file should look like this afterwards:

```jsonc
{
	// ... other settings
	"json.schemas": [
		{
			"fileMatch": ["io-package.json"],
			"url": "https://json.schemastore.org/io-package"
		},
		{
			"fileMatch": [
				"admin/jsonConfig.json",
				"admin/jsonCustom.json",
				"admin/jsonTab.json"
			],
			"url": "https://raw.githubusercontent.com/ioBroker/ioBroker.admin/master/packages/jsonConfig/schemas/jsonConfig.json"
		}
	]
}
```
