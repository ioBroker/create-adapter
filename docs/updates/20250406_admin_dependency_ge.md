# Change global dependency `admin` to greater equal instead of equal

To support newer `admin` dependency versions, greater equal (`>=`) is added instead of a specific fix version in `io-package.json`.

```diff
  "globalDependencies": [
    {
-     "admin": "7.0.23"
+     "admin": ">=7.0.23"
    }
  ]
```