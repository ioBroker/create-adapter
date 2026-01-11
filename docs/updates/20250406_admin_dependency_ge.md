# Update Global Dependency `admin` to Use Greater Than Equal (`>=`)

To allow support for newer versions of the `admin` dependency, the version constraint in `io-package.json` has been updated from a fixed version to greater or equal (`>=`) version.

`io-package.json`
```diff
  "globalDependencies": [
    {
-     "admin": "7.0.23"
+     "admin": ">=7.6.17"
    }
  ]
```