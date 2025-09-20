# Add JSON5 support to VSCode settings template

The VSCode settings template has been enhanced to include JSON5 file support for admin configuration files, improving the developer experience when working with JSON5 versions of ioBroker admin configurations.

## What changed

The `fileMatch` array in the JSON schema configuration within the VSCode settings template now includes `.json5` file extensions alongside the existing `.json` patterns.

**Before:**
```json
"fileMatch": [
    "admin/jsonConfig.json",
    "admin/jsonCustom.json",
    "admin/jsonTab.json"
]
```

**After:**
```json
"fileMatch": [
    "admin/jsonConfig.json",
    "admin/jsonConfig.json5",
    "admin/jsonCustom.json",
    "admin/jsonCustom.json5",
    "admin/jsonTab.json",
    "admin/jsonTab.json5"
]
```

## Manual migration for existing adapters

**This change only affects newly created adapters.** Existing adapters continue to work without any changes required.

However, if you want to update an existing adapter to get JSON5 support in VSCode, you can manually update your `.vscode/settings.json` file:

1. Open your existing adapter's `.vscode/settings.json` file
2. Find the `json.schemas` section with the admin configuration schema
3. Update the `fileMatch` array to include the JSON5 patterns:

```json
{
    "fileMatch": [
        "admin/jsonConfig.json",
        "admin/jsonConfig.json5",
        "admin/jsonCustom.json",
        "admin/jsonCustom.json5",
        "admin/jsonTab.json",
        "admin/jsonTab.json5"
    ],
    "url": "https://raw.githubusercontent.com/ioBroker/ioBroker.admin/master/packages/jsonConfig/schemas/jsonConfig.json"
}
```

## Benefits

- **Enhanced JSON5 support**: VSCode will now provide JSON schema validation for both `.json` and `.json5` admin configuration files
- **Better developer experience**: Developers get autocompletion, error checking, and documentation tooltips when editing JSON5 admin configs
- **Consistent development experience**: Same level of support across both JSON and JSON5 file formats
- **Future-ready**: Prepared for JSON5 adoption in ioBroker admin configurations

## No functional changes

This change does not affect the functionality of adapters in any way:
- All existing functionality remains unchanged
- JSON schema validation continues to work exactly the same for existing JSON files
- Only adds support for JSON5 files without breaking any existing workflows
- No changes are required to existing adapters