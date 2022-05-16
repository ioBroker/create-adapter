# Base `tsconfig.json` on `@tsconfig/node` packages

The `tsconfig/bases` respository provides optimized packages which make it easier to target a specific Node.js version for type checking and TypeScript compilation.

To use this in your adapter, install **one** of the following packages:

```bash
npm i -D @tsconfig/node12
npm i -D @tsconfig/node14
npm i -D @tsconfig/node16
```

depending on the minimum Node.js version you want to support.

How the `tsconfig.json` should look like depends on a couple of other settings, so it is easiest if you create a copy of your adapter using the replay feature and copy the resulting `tsconfig.json` over. Depending on the selected package above, you might need to update the `"extends"` clause, e.g. for Node.js 14:

```diff
{
	// To update the compilation target, install a different version of @tsconfig/node... and reference it here
-	// https://github.com/tsconfig/bases#node-12-tsconfigjson
-	"extends": "@tsconfig/node12/tsconfig.json",
+	// https://github.com/tsconfig/bases#node-14-tsconfigjson
+	"extends": "@tsconfig/node14/tsconfig.json",
	"compilerOptions": {
```
