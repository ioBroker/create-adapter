# Fixed `lint` command for JS adapters

The `lint` command for JS adapters was incorrectly defined and did nothing. To fix this, open `package.json` and look for the `"lint"` script.

Apply this change

```diff
-    "lint": "eslint",
+    "lint": "eslint .",
```

or this change

```diff
-    "lint": "eslint --ext .js,.jsx",
+    "lint": "eslint --ext .js,.jsx .",
```

If the script is defined differently, there should be no need to change it.

**Note:** You will have to fix a couple of linting errors after doing this. Some can be automatically fixed, some require configuration changes that are too complex to describe here. If you are unable to fix some, try re-creating your adapter with the newest creator version and then copy your code over.
