# Update `io-packages.json` JSON schema reference

For JSON schema support in Visual Studio Code, the following file needs to be updated:

## `.vscode/settings.json`

```diff
    "json.schemas": [
        {
            "fileMatch": ["io-package.json"],
-           "url": "https://json.schemastore.org/io-package"
+           "url": "https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/schemas/io-package.json"
        },
        {
```
