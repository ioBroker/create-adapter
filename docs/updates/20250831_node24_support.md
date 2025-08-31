# Add Node.js 24 support to existing adapters

Node.js 24 is now available as an LTS version and can be used for ioBroker adapters. This guide shows how to manually update existing adapters to support Node.js 24.

## Update minimum Node.js version

If you want to set Node.js 24 as the minimum required version, update the `engines` field in `package.json`:

```diff
  "engines": {
-   "node": ">= 20"
+   "node": ">= 24"
  },
```

## Update testing configuration

To test your adapter against Node.js 24, update `.github/workflows/test-and-release.yml`:

```diff
     runs-on: ${{ matrix.os }}
     strategy:
       matrix:
-        node-version: [18.x, 20.x, 22.x]
+        node-version: [18.x, 20.x, 22.x, 24.x]
         os: [ubuntu-latest, windows-latest, macos-latest]
```

If you also want to update the check and deploy steps to use Node.js 24:

```diff
     steps:
       - uses: ioBroker/testing-action-check@v1
         with:
-          node-version: '20.x'
+          node-version: '24.x'
           # Uncomment the following line if your adapter cannot be installed using 'npm ci'
           # install-command: 'npm install'
           lint: true
```

```diff
 #    steps:
 #      - uses: ioBroker/testing-action-deploy@v1
 #        with:
-#          node-version: '20.x'
+#          node-version: '24.x'
 #          # Uncomment the following line if your adapter cannot be installed using 'npm ci'
 #          # install-command: 'npm install'
 #          npm-token: ${{ secrets.NPM_TOKEN }}
```

## Update TypeScript configuration (if applicable)

When using TypeScript or when type-checking is enabled, the type definitions and `tsconfig.json` need to be updated.

To update the Node.js type definitions for Node.js 24:

```bash
npm i -D @types/node@24
```

If you are upgrading from an older Node.js version, uninstall the old tsconfig base:

```bash
npm uninstall -D @tsconfig/node20
# or @tsconfig/node22 if upgrading from Node.js 22
```

Then install the Node.js 24 tsconfig base:

```bash
npm i -D @tsconfig/node24
```

Finally, update your `tsconfig.json` to reference the new base:

```diff
{
-  "extends": "@tsconfig/node20/tsconfig.json",
+  "extends": "@tsconfig/node24/tsconfig.json",
  // ...
}
```

## Note

Remember that using Node.js 24 as the minimum version means users will need to have Node.js 24 or higher installed to run your adapter. Consider your target audience when deciding on the minimum version.