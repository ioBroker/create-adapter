# Update package configuration to reflect minimum Node.js version required

As Node.js 14 is EOL and Node.js 20 is already available, new adapters should support either Node.js 16, 18 or 20 as minimum version. There are a few changes necessary in `package.json` to reflect this when upgrading an existing adapter.

The `engines` field must specify the minimum version:

```diff
  "engines": {
-   "node": ">= 14"
+   "node": ">= 16"
  },
```

```diff
  "engines": {
-   "node": ">= 14"
+   "node": ">= 18"
  },
```

```diff
  "engines": {
-   "node": ">= 14"
+   "node": ">= 20"
  },
```

When using TypeScript or when type-checking is enabled, the type definitions need to be updated aswell. Run **one** of the following commands depending on the desired Node.js version:

```bash
npm i -D @types/node@16
npm i -D @types/node@18
npm i -D @types/node@20
```

TypeScript developers also have to update the `tsconfig.json` base to the correct version. This is done in multiple steps:

First, uninstall the old tsconfig base:

```
npm uninstall -D @tsconfig/node14
```

(or an even older version if you still use that).

Then, run **one** of the following commands depending on the desired Node.js version:

```bash
npm i -D @tsconfig/node16
npm i -D @tsconfig/node18
npm i -D @tsconfig/node20
```

Last, reference this new base in your `tsconfig.json` by replacing `node14` with the version you just installed the tsconfig for, e.g. `node18` for Node.js 18:

```diff
{
-  "extends": "@tsconfig/node14/tsconfig.json",
+  "extends": "@tsconfig/node18/tsconfig.json",
  // ...
}
```
