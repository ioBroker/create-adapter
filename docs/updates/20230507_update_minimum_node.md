# Update `packages.json` to refelct minimum node version required

As node 14 is EOL and node 20 is already available, new adapters should support either node 16, 18 or 20 as minimum version.
If you decide to increase the minimum node version your adapter requires, edit package.json and change the following line depending on the rrequired minimum node version:

## `package.json`

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
