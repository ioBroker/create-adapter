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

In addition, the testing workflow also needs to be updated. To do this, edit `.github/workflows/test-and-release.yml` as follows:

```diff
     steps:
       - uses: ioBroker/testing-action-check@v1
         with:
-          node-version: '16.x'
+          node-version: '18.x'
           # Uncomment the following line if your adapter cannot be installed using 'npm ci'
           # install-command: 'npm install'
           lint: true
...
     runs-on: ${{ matrix.os }}
     strategy:
       matrix:
-        node-version: [14.x, 16.x, 18.x]
+        node-version: [16.x, 18.x, 20.x]
         os: [ubuntu-latest, windows-latest, macos-latest]

     steps:
...
 #    steps:
 #      - uses: ioBroker/testing-action-deploy@v1
 #        with:
-#          node-version: '16.x'
+#          node-version: '18.x'
 #          # Uncomment the following line if your adapter cannot be installed using 'npm ci'
 #          # install-command: 'npm install'
 #          npm-token: ${{ secrets.NPM_TOKEN }}
```

---

When using TypeScript or when type-checking is enabled, the type definitions and `tsconfig.json` need to be updated aswell.
First, update TypeScript itself:

```bash
npm i -D "typescript@~5.0.4"
```

To update the Node.js type definitions, run **one** of the following commands depending on the desired Node.js version:

```bash
npm i -D @types/node@16
npm i -D @types/node@18
npm i -D @types/node@20
```

Next, uninstall the old tsconfig base:

```bash
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
