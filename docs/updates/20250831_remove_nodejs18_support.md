# Remove Node.js 18 support from adapter creator

Node.js 18 is approaching end-of-life and new adapters should target more recent Node.js versions. The adapter creator now only supports Node.js 20 and 22 as minimum version options.

## What changed

- **Removed Node.js 18** from the available minimum version choices
- **Updated migration logic** to automatically upgrade existing projects using Node.js 18 to Node.js 20
- **Updated TypeScript interfaces** to reflect the new supported versions (`"20" | "22"`)

## Migration behavior

When migrating existing adapters that currently use Node.js 18 (`@tsconfig/node18` dependency), the tool will automatically select **Node.js 20** as the target version instead. This ensures a smooth upgrade path for existing projects while preventing new adapters from being created with outdated Node.js versions.

## Manual migration for existing adapters

If you have an existing adapter currently targeting Node.js 18, you should manually upgrade to Node.js 20 or 22:

### 1. Update package.json engines field

```diff
{
  "engines": {
-   "node": ">= 18"
+   "node": ">= 20"
  }
}
```

### 2. Update Node.js type definitions

```bash
npm i -D @types/node@20
```

### 3. Update TypeScript configuration base

First, uninstall the old tsconfig base:
```bash
npm uninstall -D @tsconfig/node18
```

Then install the new one:
```bash
npm i -D @tsconfig/node20
```

### 4. Update tsconfig.json

```diff
{
- "extends": "@tsconfig/node18/tsconfig.json",
+ "extends": "@tsconfig/node20/tsconfig.json",
  // ...
}
```

### 5. Update GitHub Actions workflow

Edit `.github/workflows/test-and-release.yml`:

```diff
     steps:
       - uses: ioBroker/testing-action-check@v1
         with:
-          node-version: '18.x'
+          node-version: '20.x'
           lint: true

     strategy:
       matrix:
-        node-version: [18.x, 20.x, 22.x]
+        node-version: [20.x, 22.x]
         os: [ubuntu-latest, windows-latest, macos-latest]
```

## Benefits

- **Better security**: Node.js 20+ includes important security improvements
- **Enhanced performance**: Newer Node.js versions offer better performance
- **Modern features**: Access to the latest JavaScript and Node.js features
- **Long-term support**: Node.js 20 is an LTS version with extended support until 2026