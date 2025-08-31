# Fix outdated jsonConfig schema URL in VSCode settings

The VSCode settings for JSON Config schema validation have been updated to use the official schema location. If you have an existing adapter with VSCode configuration, you should update the schema URL for better IntelliSense and validation.

## What changed

The jsonConfig schema URL has been updated from the old location to the official source:

**Old URL (deprecated):**
```
https://raw.githubusercontent.com/ioBroker/adapter-react-v5/main/schemas/jsonConfig.json
```

**New URL (official):**
```
https://raw.githubusercontent.com/ioBroker/ioBroker.admin/master/packages/jsonConfig/schemas/jsonConfig.json
```

## How to update your adapter

Open `.vscode/settings.json` in your adapter directory and locate the `json.schemas` section. Update the jsonConfig schema URL:

```diff
{
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
-			"url": "https://raw.githubusercontent.com/ioBroker/adapter-react-v5/main/schemas/jsonConfig.json"
+			"url": "https://raw.githubusercontent.com/ioBroker/ioBroker.admin/master/packages/jsonConfig/schemas/jsonConfig.json"
		}
	]
}
```

## Benefits

- Uses the official, actively maintained schema from ioBroker.admin
- Ensures accurate validation and IntelliSense for JSON Config files
- Future-proofs your development environment against schema changes