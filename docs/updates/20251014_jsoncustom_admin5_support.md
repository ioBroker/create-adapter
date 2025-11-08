# Add jsonCustom.json for Admin 5 support

Admin 5 will no longer support `custom_m.html` files for custom state settings. Instead, a new JSON-based configuration format `jsonCustom.json` is required. This update ensures that adapters generated with create-adapter support both Admin 4 (with `custom_m.html`) and Admin 5 (with `jsonCustom.json`).

## What changed

When you select the "Custom options for states" feature during adapter creation, the tool now generates both:
- `admin/custom_m.html` - for backward compatibility with Admin 4
- `admin/jsonCustom.json` - new format required for Admin 5

The `jsonCustom.json` file follows the same JSON Config schema format used by `jsonConfig.json`, making it consistent with modern ioBroker admin interfaces.

## Example jsonCustom.json structure

```json
{
    "i18n": true,
    "type": "panel",
    "items": {
        "enabled": {
            "type": "checkbox",
            "label": "enabled",
            "newLine": true
        },
        "interval": {
            "type": "text",
            "label": "period of time",
            "newLine": true
        },
        "state": {
            "type": "text",
            "label": "new state",
            "newLine": true
        },
        "setAck": {
            "type": "checkbox",
            "label": "ack",
            "newLine": true
        }
    }
}
```

## For existing adapters

If you have an existing adapter that uses `custom_m.html`, you can create a `jsonCustom.json` file in your `admin` directory following the structure above. The VSCode schema validation is already configured to support this file format.

### Migration steps:

1. Create `admin/jsonCustom.json` with the structure shown above
2. Customize the `items` object to match your adapter's custom state settings
3. Keep your existing `custom_m.html` for backward compatibility with Admin 4
4. Set `"supportCustoms": true` in your `io-package.json` (should already be set if you have custom_m.html)

## Benefits

- **Admin 5 compatibility**: Your adapter will work with the latest Admin version
- **Backward compatibility**: Admin 4 users can still use your adapter
- **Better tooling**: JSON Config format provides IntelliSense and validation in VSCode
- **Consistency**: Uses the same configuration format as the main adapter settings

## References

- [JSON Config Schema Documentation](https://github.com/ioBroker/ioBroker.admin/tree/master/packages/jsonConfig/schemas)
- [Example from ioBroker.sql](https://github.com/ioBroker/ioBroker.sql/blob/master/admin/jsonCustom.json)
