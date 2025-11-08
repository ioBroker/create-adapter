# Add `adminUI.config` for adapters without configuration UI

The generator now automatically adds the `adminUI.config: "none"` property to `io-package.json` for adapters and widgets that don't have a configuration UI. This ensures compliance with the adapter-checker warning W164.

## What changed

When creating adapters or widgets without a configuration UI, the generated `io-package.json` now includes:

```json
{
  "common": {
    "noConfig": true,
    "adminUI": {
      "config": "none"
    }
  }
}
```

This change affects:
- **Widget-only adapters** (VIS widgets) - always have no configuration UI
- **Adapters with "No UI" selected** - explicitly configured without admin UI

## Impact on existing adapters

For existing adapters being migrated or updated, this change only affects the generated template. Existing `io-package.json` files are not automatically modified.

## Manual migration for existing adapters

### If your adapter has `noConfig: true`

If your adapter or widget already has `"noConfig": true` in the `io-package.json` but is missing the `adminUI` section, you should add it to pass the adapter-checker validation:

```diff
{
  "common": {
    "noConfig": true,
+   "adminUI": {
+     "config": "none"
+   }
  }
}
```

### For widget adapters

All widget adapters (with `"onlyWWW": true` and `"noConfig": true`) should include the `adminUI` section:

```diff
{
  "common": {
    "onlyWWW": true,
    "noConfig": true,
    "singleton": true,
    "type": "visualization-widgets",
    "mode": "once",
+   "adminUI": {
+     "config": "none"
+   }
  }
}
```

## Why this change

This change addresses the adapter-checker warning **[W164]**: "Adapters without config 'common.noConfig = true' should also set 'common.adminUI.config = none'".

By including both properties, the adapter metadata clearly indicates that:
- No configuration UI is provided (`noConfig: true`)
- The admin UI framework is explicitly set to none (`adminUI.config: "none"`)

This improves consistency and helps automation tools correctly identify adapters without configuration options.

## Backward compatibility

Adding the `adminUI.config: "none"` property is backward compatible. Existing adapters continue to work without this property, but adding it helps pass adapter-checker validation and follows current best practices.
