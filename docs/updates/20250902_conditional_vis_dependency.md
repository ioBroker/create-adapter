# Conditional VIS dependency based on widget function

The VIS dependency behavior has been updated to be conditional based on the widget's purpose. Previously, all adapters with VIS widgets would automatically get a VIS dependency. Now, VIS dependencies are only added when the widget is the main adapter functionality.

## What changed

When creating an adapter with VIS features, you'll now be asked:

**"What is the function of the widget?"**
- "The widget is the main adapter functionality" → Includes VIS dependency
- "The adapter also works without the visualization of the widget" → No VIS dependency

The `io-package.json` dependencies and `restartAdapters` arrays now conditionally include VIS based on this choice.

## Impact on existing adapters

For existing adapters being migrated or updated, the question defaults to "additional" functionality, which means:
- VIS dependencies will **NOT** be included by default
- If your adapter requires VIS to function properly, you'll need to manually update your configuration

## Manual migration for existing adapters

### If your widget is the main functionality

If your adapter's primary purpose is the VIS widget and it requires VIS to function, update your `io-package.json`:

```diff
{
  "dependencies": [
    { "js-controller": ">=6.0.11" },
+   "vis"
  ],
+ "restartAdapters": ["vis"],
  // ... other configuration
}
```

### If your widget is additional functionality

If your adapter works independently and the widget is just an extra feature, no changes are needed. The VIS dependency will not be included, which is the correct behavior.

## Before/After examples

**Before** (all widgets got VIS dependency):
```json
{
  "dependencies": [
    { "js-controller": ">=6.0.11" },
    "vis"
  ],
  "restartAdapters": ["vis"]
}
```

**After** (conditional based on function):

Main function widget:
```json
{
  "dependencies": [
    { "js-controller": ">=6.0.11" },
    "vis"
  ],
  "restartAdapters": ["vis"]
}
```

Additional function widget:
```json
{
  "dependencies": [
    { "js-controller": ">=6.0.11" }
  ]
  // no restartAdapters for VIS
}
```

## Why this change

This change provides more granular control over VIS dependencies:
- Avoids unnecessary dependencies for adapters where widgets are supplementary
- Ensures only adapters that truly require VIS will depend on it
- Reduces potential conflicts and installation issues
- Aligns with the principle of minimal dependencies

## Backward compatibility

The migration function defaults to "additional" functionality to ensure existing configurations don't suddenly gain new dependencies when updated. This is a conservative approach that requires manual opt-in for VIS dependencies.