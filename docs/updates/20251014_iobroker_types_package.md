# Replace @types/iobroker with @iobroker/types

The adapter creator now uses the official `@iobroker/types` package instead of the deprecated `@types/iobroker` package. This provides better type definitions and ensures you're using the actively maintained types package.

## What changed

For adapters with TypeScript or type checking enabled, the `package.json` now includes `@iobroker/types` using npm alias syntax. This ensures that IDEs and TypeScript treat it like a standard `@types` package, providing seamless type discovery.

**Before:**
- No explicit `@types/iobroker` package was included
- Types were expected to be provided by other packages or manually installed

**After:**
```json
"devDependencies": {
    "@types/iobroker": "npm:@iobroker/types@^7.0.7",
    // ... other dependencies
}
```

Additionally, comments in generated `adapter-config.d.ts` files have been updated to reference the correct package:

**Before:**
```typescript
// This file extends the AdapterConfig type from "@types/iobroker"
```

**After:**
```typescript
// This file extends the AdapterConfig type from "@iobroker/types"
```

## Manual migration for existing adapters

**This change only affects newly created adapters.** Existing adapters continue to work without any changes required.

However, if you want to update an existing adapter to use the modern types package, follow these steps:

### 1. Update package.json

Add the `@iobroker/types` package using npm alias in your `devDependencies`:

```json
"devDependencies": {
    "@types/iobroker": "npm:@iobroker/types@^7.0.7",
    // ... other dependencies
}
```

### 2. Install dependencies

Run `npm install` to install the new types package:

```bash
npm install
```

### 3. Update adapter-config.d.ts comments (optional)

If you want to update the documentation, you can change the comments in your `src/lib/adapter-config.d.ts` (TypeScript) or `lib/adapter-config.d.ts` (JavaScript with type checking) file:

```diff
-// This file extends the AdapterConfig type from "@types/iobroker"
+// This file extends the AdapterConfig type from "@iobroker/types"
```

## Benefits

- **Official types package**: Uses the actively maintained `@iobroker/types` package
- **Better type definitions**: Access to the latest and most accurate type definitions
- **Seamless IDE integration**: The npm alias ensures IDEs treat it like a standard `@types` package
- **No code changes required**: The alias maintains full backward compatibility

## No functional changes

This change does not affect the runtime functionality of adapters in any way. It only improves the development experience by providing better type definitions.
